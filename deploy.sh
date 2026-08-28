#!/usr/bin/env bash
# Usage: ./deploy.sh [environment]
# Builds the app and syncs dist/ to S3, then invalidates the CloudFront cache.
# Requires: aws CLI, pnpm, terraform (already applied at least once)

set -euo pipefail

env=$1
if [[ "$env" != "dev" && "$env" != "prod" ]]; then
  echo "env must be dev or prod"
  exit 1
fi

echo "==> Reading Terraform outputs for environment: $env"
cd infrastructure/

# backend config
BUCKET=ainterview-state-files   
KEY=state/terraform_FE_$env.tfstate      
REGION=eu-west-2                     
ENCRYPT=true

terraform init -reconfigure \
    -backend-config="bucket=$BUCKET" \
    -backend-config="key=$KEY" \
    -backend-config="region=$REGION" \
    -backend-config="encrypt=$ENCRYPT"

terraform apply -auto-approve \
    -var="environment=$env"

BUCKET=$(terraform output -raw s3_bucket_name)
CF_ID=$(terraform output -raw cloudfront_distribution_id)
CF_URL=$(terraform output -raw cloudfront_url)

echo "==> Building frontend"
cd ..
pnpm build

echo "==> Syncing dist/ to s3://$BUCKET"
aws s3 sync dist/ "s3://$BUCKET" \
  --delete \
  --cache-control "public,max-age=31536000,immutable" \
  --exclude "index.html"

# index.html must not be cached so clients always get the latest entry point
aws s3 cp dist/index.html "s3://$BUCKET/index.html" \
  --cache-control "no-cache,no-store,must-revalidate" \
  --content-type "text/html"

echo "==> Invalidating CloudFront cache ($CF_ID)"
aws cloudfront create-invalidation \
  --distribution-id "$CF_ID" \
  --paths "/*"

echo ""
echo "Deploy complete: $CF_URL"
cd ..
