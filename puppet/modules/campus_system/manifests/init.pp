# ==============================================================
# Puppet Module: campus_system (init.pp)
# Aggregates Docker, App, and Nagios Agent configuration classes
# ==============================================================

class campus_system {
  include campus_system::docker_setup
  include campus_system::campus_app
  include campus_system::monitoring_agent

  # Enforce declaration order: Docker setup -> App deployment -> Monitoring
  Class['campus_system::docker_setup']
    -> Class['campus_system::campus_app']
    -> Class['campus_system::monitoring_agent']
}

