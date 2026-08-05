variable "aws_region" {
  description = "AWS region to deploy resources in"
  type        = string
  default     = "eu-west-2"
}

variable "project_name" {
  description = "Name prefix for all resources"
  type        = string
  default     = "ainterview"
}

variable "environment" {
  description = "Deployment environment (e.g. prod, staging)"
  type        = string
}

# Set to your domain name to enable a custom domain + ACM cert.
# Leave as "" to use the default *.cloudfront.net domain.
variable "domain_name" {
  description = "Custom domain name (e.g. app.example.com). Leave empty to skip."
  type        = string
  default     = ""
}

# Only used when domain_name is set.
variable "acm_certificate_arn" {
  description = "ACM certificate ARN in us-east-1 for the custom domain"
  type        = string
  default     = ""
}
