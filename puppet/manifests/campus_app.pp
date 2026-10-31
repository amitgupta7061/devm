# ==============================================================
# Puppet Manifest: campus_app.pp
# Automates App Directory setup, Systemd Unit, and Compose Lifecycle
# ==============================================================

class campus_system::campus_app {

  $app_dir = '/opt/campus-system'

  # Ensure target application root directory exists
  file { $app_dir:
    ensure => directory,
    owner  => 'ubuntu',
    group  => 'ubuntu',
    mode   => '0755',
  }

  file { "${app_dir}/logs":
    ensure => directory,
    owner  => 'ubuntu',
    group  => 'ubuntu',
    mode   => '0755',
    require => File[$app_dir],
  }

  # Ensure Systemd Service unit file exists for automatic container restart
  file { '/etc/systemd/system/smart-campus.service':
    ensure  => file,
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    content => @(EOF)
[Unit]
Description=Smart Campus Service Management System (Docker Compose)
Requires=docker.service
After=docker.service network.target

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/campus-system
ExecStart=/usr/bin/docker compose -f /opt/campus-system/docker-compose.yml up -d --remove-orphans
ExecStop=/usr/bin/docker compose -f /opt/campus-system/docker-compose.yml down
TimeoutStartSec=300

[Install]
WantedBy=multi-user.target
EOF
    ,
    notify  => Exec['systemd-daemon-reload'],
  }

  exec { 'systemd-daemon-reload':
    command     => '/bin/systemctl daemon-reload',
    refreshonly => true,
  }

  service { 'smart-campus':
    ensure  => running,
    enable  => true,
    require => [
      File['/etc/systemd/system/smart-campus.service'],
      Class['campus_system::docker_setup'],
    ],
  }
}

