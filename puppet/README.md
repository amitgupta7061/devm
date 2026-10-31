# Puppet Configuration Management for Smart Campus System

Course: **INT333 - DevOps Advanced Configuration Management**  
University: **Lovely Professional University (LPU)**

---

## 1. Role in Architecture

In this project, **Puppet** serves as the automated server configuration management tool. It eliminates manual setup mistakes and ensures the production EC2 host provisioned by Terraform converges to the desired state.

### Key Responsibilities:
1. **System Packages**: Automatically installs `docker.io`, `docker-compose`, `curl`, `git`, `htop`, `nagios-plugins`, and `nagios-nrpe-server`.
2. **Daemon Configuration**: Ensures the Docker daemon is enabled on boot and running (`service { 'docker': ensure => running }`).
3. **User Group Management**: Automatically grants non-root execution privileges by ensuring users `ubuntu` and `jenkins` belong to the `docker` group.
4. **App Directory Tree**: Configures `/opt/campus-system` directory structure with appropriate ownership and read-write-execute permissions.
5. **Systemd Service**: Deploys `/etc/systemd/system/smart-campus.service` to supervise the multi-container Docker Compose application.
6. **Nagios NRPE Agent**: Deploys NRPE local configurations with predefined checks for API health (`check_campus_api`), database connectivity (`check_campus_mongo`), and server resource thresholds.

---

## 2. Manifest Hierarchy

```
puppet/
├── manifests/
│   ├── site.pp              # Main node classifier
│   ├── docker_setup.pp      # Docker CE and group configuration
│   ├── campus_app.pp        # Application directories & Systemd unit
│   └── monitoring_agent.pp  # NRPE monitoring agent & custom commands
├── modules/
│   └── campus_system/
│       └── manifests/
│           └── init.pp      # Module entrypoint & execution order
└── README.md
```

---

## 3. How to Execute Puppet Manifests

### Standalone Mode (Masterless / Single Server):
To test or apply the configuration directly on the server without needing a dedicated Puppet Master:

```bash
# 1. Install Puppet agent (if not present)
sudo apt-get update && sudo apt-get install -y puppet

# 2. Syntax check the manifests
puppet parser validate manifests/*.pp

# 3. Apply the configuration (Dry Run / Noop mode)
sudo puppet apply --noop --modulepath=modules manifests/site.pp

# 4. Enforce the configuration live
sudo puppet apply --modulepath=modules manifests/site.pp
```

### Viva Explanation Key Points:
- **Idempotence**: Running `puppet apply` multiple times produces the exact same state without causing errors or duplicate services.
- **Resource Declaration Syntax**: `package`, `file`, `service`, `exec`, and `user` are the standard declarative resource types used.
- **Dependency Ordering**: `->` (ordering arrow) ensures Docker is fully installed and started before the application containers and monitoring agents are launched.

