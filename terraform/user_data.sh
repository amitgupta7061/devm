#!/bin/bash
# ==============================================================
# AWS EC2 Cloud-Init Bootstrap Script for Smart Campus System
# Course: INT333 - DevOps Advanced Configuration Management
# ==============================================================

set -e

echo "[BOOTSTRAP] Updating system packages..."
apt-get update -y
apt-get upgrade -y

echo "[BOOTSTRAP] Installing baseline utilities..."
apt-get install -y \
  apt-transport-https \
  ca-certificates \
  curl \
  gnupg \
  lsb-release \
  git \
  htop \
  net-tools \
  nagios-plugins \
  nagios-nrpe-server

echo "[BOOTSTRAP] Installing Docker Engine & Docker Compose Plugin..."
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Enable and start Docker daemon
systemctl enable docker
systemctl start docker

# Add default ubuntu user to docker group
usermod -aG docker ubuntu

# Setup project directory
mkdir -p /opt/campus-system
chown -R ubuntu:ubuntu /opt/campus-system

echo "[BOOTSTRAP] EC2 Initialization complete. Ready for Puppet and Docker Compose."

