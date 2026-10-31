# ==============================================================
# Puppet Manifest: monitoring_agent.pp
# Automates Nagios NRPE Monitoring Agent and Service Checks
# ==============================================================

class campus_system::monitoring_agent {

  # Install Nagios Remote Plugin Executor & Standard Plugins
  package { ['nagios-nrpe-server', 'nagios-plugins', 'nagios-plugins-basic']:
    ensure => installed,
  }

  # Ensure NRPE configuration defines checks for the Smart Campus system
  file { '/etc/nagios/nrpe_local.cfg':
    ensure  => file,
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    content => @(EOF)
# Custom NRPE checks for Smart Campus System (INT333)
command[check_campus_api]=/usr/lib/nagios/plugins/check_http -H 127.0.0.1 -p 5000 -u /api/health -s '"status":"UP"'
command[check_campus_web]=/usr/lib/nagios/plugins/check_http -H 127.0.0.1 -p 80 -u /
command[check_campus_mongo]=/usr/lib/nagios/plugins/check_tcp -H 127.0.0.1 -p 27017
command[check_root_disk]=/usr/lib/nagios/plugins/check_disk -w 20% -c 10% -p /
command[check_server_load]=/usr/lib/nagios/plugins/check_load -r -w 2.0,1.5,1.0 -c 4.0,3.0,2.0
command[check_docker_service]=/usr/lib/nagios/plugins/check_procs -c 1: -a dockerd
EOF
    ,
    require => Package['nagios-nrpe-server'],
    notify  => Service['nagios-nrpe-server'],
  }

  # Manage NRPE service
  service { 'nagios-nrpe-server':
    ensure     => running,
    enable     => true,
    hasstatus  => true,
    hasrestart => true,
    require    => Package['nagios-nrpe-server'],
  }
}

