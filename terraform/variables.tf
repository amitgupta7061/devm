# ==============================================================
# Terraform Variables - Smart Campus AWS Infrastructure
# Course: INT333 - DevOps Advanced Configuration Management
# University: Lovely Professional University
# ==============================================================

variable "aws_region" {
  description = "AWS deployment region"
  type        = string
  default     = "ap-south-1" # AWS Asia Pacific (Mumbai) region for lowest latency in India
}

variable "environment" {
  description = "Deployment environment name"
  type        = string
  default     = "production"
}

variable "project_name" {
  description = "Project identifier"
  type        = string
  default     = "smart-campus"
}

variable "instance_type" {
  description = "Cost-effective EC2 instance type (Free Tier eligible: t2.micro or t3.micro)"
  type        = string
  default     = "t2.micro"
}

variable "ami_id" {
  description = "Ubuntu 22.04 LTS AMI ID (default is canonical ap-south-1 Ubuntu 22.04)"
  type        = string
  default     = "ami-03f4878e83fedf421" # Canonical Ubuntu 22.04 in ap-south-1
}

variable "key_name" {
  description = "AWS SSH Key Pair name for secure instance access"
  type        = string
  default     = "campus-devops-key"
}

variable "allowed_cidr_blocks" {
  description = "CIDR blocks allowed for administrative SSH and Web access"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

