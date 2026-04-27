# CloudFormation Student Demos (JSON)

This folder contains simple, reusable CloudFormation templates in JSON:

0. `00-all-in-one.json`
   - Creates in one stack: VPC, public subnet, route/IGW, security group, EC2, S3.
   - Best for first-time students who want one command.

1. `01-vpc-network.json`
   - Creates: VPC, public subnet, private subnet, internet gateway, route table, security group.
   - Exports key IDs so other stacks can reuse them.

2. `02-ec2-instance.json`
   - Creates: one EC2 web server.
   - Reuses exported subnet and security group from the network stack.

3. `03-s3-bucket.json`
   - Creates: one S3 bucket with versioning + encryption + public access block.

## Suggested teaching order

Option A (beginner): deploy `00-all-in-one.json` first.

Option B (modular): deploy in this order:
1. Deploy network stack
2. Deploy EC2 stack
3. Deploy S3 stack

## Example AWS CLI commands

### 0) Deploy all-in-one (single stack)
```bash
aws cloudformation deploy \
  --stack-name student-all-in-one \
  --template-file 00-all-in-one.json \
  --parameter-overrides EnvironmentName=dev KeyPairName=YOUR_KEYPAIR InstanceType=t3.micro BucketNamePrefix=travel237-allinone \
  --capabilities CAPABILITY_NAMED_IAM
```

### 1) Deploy network
```bash
aws cloudformation deploy \
  --stack-name student-network \
  --template-file 01-vpc-network.json \
  --parameter-overrides EnvironmentName=dev VpcCidr=10.0.0.0/16 PublicSubnetCidr=10.0.1.0/24 PrivateSubnetCidr=10.0.2.0/24 AllowedSshCidr=0.0.0.0/0 \
  --capabilities CAPABILITY_NAMED_IAM
```

### 2) Deploy EC2
```bash
aws cloudformation deploy \
  --stack-name student-ec2 \
  --template-file 02-ec2-instance.json \
  --parameter-overrides EnvironmentName=dev EnvironmentExportPrefix=dev KeyPairName=YOUR_KEYPAIR InstanceType=t3.micro
```

### 3) Deploy S3
```bash
aws cloudformation deploy \
  --stack-name student-s3 \
  --template-file 03-s3-bucket.json \
  --parameter-overrides EnvironmentName=dev BucketNamePrefix=travel237-demo
```

## Notes for students

- S3 bucket names must be globally unique.
- Change `EnvironmentName` to create separate environments (`dev`, `test`, `prod`).
- Keep templates reusable by using Parameters and Outputs.
