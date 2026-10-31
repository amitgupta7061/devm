# ==============================================================
# Puppet Manifest: docker_setup.pp
# Automates Docker CE installation, service management, and groups
# ==============================================================

class campus_system::docker_setup {

  # List of essential baseline packages
  $prereq_packages = [
    'apt-transport-https',
    'ca-certificates',
    'curl',
    'gnupg',
    'lsb-release',
    'git',
    'htop',
    'net-tools',
  ]

  package { $prereq_packages:
    ensure => installed,
  }

  # Ensure Docker package is installed
  package { 'docker.io':
    ensure  => installed,
    require => Package[$prereq_packages],
  }

  package { 'docker-compose':
    ensure  => installed,
    require => Package['docker.io'],
  }

  # Ensure Docker service is enabled and running
  service { 'docker':
    ensure     => running,
    enable     => true,
    hasstatus  => true,
    hasrestart => true,
    require    => Package['docker.io'],
  }

  # Ensure ubuntu user is added to the docker group
  user { 'ubuntu':
    ensure => present,
    groups => ['docker'],
    require => [Package['docker.io'], Service['docker']],
  }

  # Ensure Jenkins user has docker execution permissions if present
  user { 'jenkins':
    ensure  => present,
    groups  => ['docker'],
    require => Package['docker.io'],
  }
}

