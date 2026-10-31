# ==============================================================
# Terraform Main Configuration - Smart Campus AWS Infrastructure
# Course: INT333 - DevOps Advanced Configuration Management
# University: Lovely Professional University
# ==============================================================

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      Course      = "INT333 - DevOps ACM"
      ManagedBy   = "Terraform"
    }
  }
}

# --------------------------------------------------------------
# 1. Dedicated VPC for Smart Campus Infrastructure
# --------------------------------------------------------------
resource "aws_vpc" "campus_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "${var.project_name}-vpc"
  }
}

# --------------------------------------------------------------
# 2. Public Subnet
# --------------------------------------------------------------
resource "aws_subnet" "campus_public_subnet" {
  vpc_id                  = aws_vpc.campus_vpc.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "${var.aws_region}a"

  tags = {
    Name = "${var.project_name}-public-subnet"
  }
}

# --------------------------------------------------------------
# 3. Internet Gateway & Routing Table
# --------------------------------------------------------------
resource "aws_internet_gateway" "campus_igw" {
  vpc_id = aws_vpc.campus_vpc.id

  tags = {
    Name = "${var.project_name}-igw"
  }
}

resource "aws_route_table" "campus_public_rt" {
  vpc_id = aws_vpc.campus_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.campus_igw.id
  }

  tags = {
    Name = "${var.project_name}-public-rt"
  }
}

resource "aws_route_table_association" "campus_rta" {
  subnet_id      = aws_subnet.campus_public_subnet.id
  route_table_id = aws_route_table.campus_public_rt.id
}

# --------------------------------------------------------------
# 4. Security Group Configuration for Campus DevOps Stack
# --------------------------------------------------------------
resource "aws_security_group" "campus_sg" {
  name        = "${var.project_name}-security-group"
  description = "Security rules for Smart Campus Web, API, Jenkins, and Monitoring"
  vpc_id      = aws_vpc.campus_vpc.id

  # SSH for remote maintenance and Puppet execution
  ingress {
    description = "SSH Administration"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = var.allowed_cidr_blocks
  }

  # HTTP Web Traffic (Nginx Frontend)
  ingress {
    description = "HTTP Public Traffic"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # React Frontend Alternate Port
  ingress {
    description = "Frontend Alternate Port"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Node.js Express REST API & Health Check
  ingress {
    description = "Backend REST API"
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Jenkins CI/CD Automation Server Web Console
  ingress {
    description = "Jenkins CI/CD Automation Dashboard"
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = var.allowed_cidr_blocks
  }

  # Nagios NRPE (Remote Plugin Executor)
  ingress {
    description = "Nagios NRPE Monitoring Port"
    from_port   = 5666
    to_port     = 5666
    protocol    = "tcp"
    cidr_blocks = var.allowed_cidr_blocks
  }

  # Allow all outbound internet traffic for package updates and Docker pulls
  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-sg"
  }
}

# --------------------------------------------------------------
# 5. Cost-Conscious EC2 Instance Provisioning
# --------------------------------------------------------------
resource "aws_instance" "campus_server" {
  ami                    = var.ami_id
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.campus_public_subnet.id
  vpc_security_group_ids = [aws_security_group.campus_sg.id]
  key_name               = var.key_name

  root_block_device {
    volume_size           = 20
    volume_type           = "gp3"
    delete_on_termination = true
    encrypted             = true
  }

  user_data = file("${path.module}/user_data.sh")

  tags = {
    Name = "${var.project_name}-server"
    Role = "Campus-Management-and-DevOps"
  }
}

