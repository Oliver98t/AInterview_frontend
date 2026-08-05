output "cloudfront_url" {
  description = "Public CloudFront URL (use this if no custom domain)"
  value       = "https://${aws_cloudfront_distribution.frontend.domain_name}"
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID — needed to invalidate the cache after deploys"
  value       = aws_cloudfront_distribution.frontend.id
}

output "s3_bucket_name" {
  description = "S3 bucket name — used when uploading the built assets"
  value       = aws_s3_bucket.frontend.bucket
}

output "s3_bucket_arn" {
  value = aws_s3_bucket.frontend.arn
}
