# ==============================================================
# Terraform Outputs - Smart Campus Infrastructure
# ==============================================================

output "instance_id" {
  description = "EC2 Instance ID"
  value       = aws_instance.campus_server.id
}

output "public_ip" {
  description = "Public IP Address of the Campus Server"
  value       = aws_instance.campus_server.public_ip
}

output "application_url" {
  description = "Web Application URL"
  value       = "http://${aws_instance.campus_server.public_ip}"
}

output "api_health_url" {
  description = "Backend Health Check URL (for Nagios / Jenkins)"
  value       = "http://${aws_instance.campus_server.public_ip}:5000/api/health"
}

output "jenkins_url" {
  description = "Jenkins CI/CD Automation Web Console"
  value       = "http://${aws_instance.campus_server.public_ip}:8080"
}

output "ssh_command" {
  description = "SSH Command to access the campus server"
  value       = "ssh -i ${var.key_name}.pem ubuntu@${aws_instance.campus_server.public_ip}"
}

