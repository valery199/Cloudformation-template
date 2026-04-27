const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const instructorName = "Valery";
const schoolName = "Unixcloudtrainings";

const outputPath = path.join(
  __dirname,
  "CloudFormation_Student_Lab_Guide_Valery_Unixcloudtrainings.pdf",
);

const doc = new PDFDocument({ margin: 50, size: "A4" });
doc.pipe(fs.createWriteStream(outputPath));

function heading(text) {
  doc.moveDown(0.6);
  doc.font("Helvetica-Bold").fontSize(16).fillColor("#111111").text(text);
  doc.moveDown(0.2);
}

function subheading(text) {
  doc.moveDown(0.4);
  doc.font("Helvetica-Bold").fontSize(12).fillColor("#111111").text(text);
}

function body(text) {
  doc.font("Helvetica").fontSize(10).fillColor("#333333").text(text, {
    lineGap: 2,
  });
}

function bullet(text) {
  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#333333")
    .text(`• ${text}`, { indent: 14, lineGap: 2 });
}

function code(text) {
  doc.moveDown(0.2);
  doc
    .font("Courier")
    .fontSize(9)
    .fillColor("#222222")
    .text(text, {
      lineGap: 1.5,
      indent: 12,
    });
  doc.moveDown(0.2);
}

doc.font("Helvetica-Bold").fontSize(20).fillColor("#000000").text(
  "AWS CloudFormation Student Lab Guide",
  { align: "left" },
);
doc.font("Helvetica").fontSize(11).fillColor("#444444").text(
  "Topic: VPC, Subnet, Security Group, EC2, and S3 (JSON Templates)",
);
doc.text(`Instructor: ${instructorName}`);
doc.text(`School: ${schoolName}`);
doc.text("Instructor package: appler cloudfromation");
doc.moveDown(0.6);
doc.font("Helvetica").fontSize(10).text(
  `Generated: ${new Date().toLocaleString()}`,
);

heading("1) Lab Objectives");
bullet("Understand Infrastructure as Code (IaC) with CloudFormation.");
bullet("Deploy network resources (VPC + Subnets + Routes + SG).");
bullet("Launch an EC2 instance from template parameters.");
bullet("Create and secure an S3 bucket using policy best practices.");
bullet("Learn reusable template design with Parameters and Outputs.");

heading("2) Required Files");
bullet("00-all-in-one.json (single stack, beginner)");
bullet("01-vpc-network.json (modular network)");
bullet("02-ec2-instance.json (modular compute)");
bullet("03-s3-bucket.json (modular storage)");

heading("3) Prerequisites");
bullet("AWS account with CloudFormation permissions.");
bullet("An existing EC2 Key Pair in your target region.");
bullet("AWS CLI configured (optional, if using CLI deployment).");
bullet("Deploy in one region consistently for all stacks.");

heading("4) Option A: One-Command Beginner Deployment");
subheading("CLI Command");
code(`aws cloudformation deploy \\
  --stack-name student-all-in-one \\
  --template-file 00-all-in-one.json \\
  --parameter-overrides EnvironmentName=dev KeyPairName=YOUR_KEYPAIR InstanceType=t3.micro BucketNamePrefix=travel237-allinone \\
  --capabilities CAPABILITY_NAMED_IAM`);

subheading("Expected Result");
bullet("A VPC + public subnet + route to internet.");
bullet("A security group allowing SSH (22) and HTTP (80).");
bullet("An EC2 instance with Apache installed.");
bullet("An encrypted, versioned S3 bucket.");

heading("5) Option B: Modular Deployment");
subheading("Step 1: Network Stack");
code(`aws cloudformation deploy \\
  --stack-name student-network \\
  --template-file 01-vpc-network.json \\
  --parameter-overrides EnvironmentName=dev VpcCidr=10.0.0.0/16 PublicSubnetCidr=10.0.1.0/24 PrivateSubnetCidr=10.0.2.0/24 AllowedSshCidr=0.0.0.0/0`);

subheading("Step 2: EC2 Stack (imports network outputs)");
code(`aws cloudformation deploy \\
  --stack-name student-ec2 \\
  --template-file 02-ec2-instance.json \\
  --parameter-overrides EnvironmentName=dev EnvironmentExportPrefix=dev KeyPairName=YOUR_KEYPAIR InstanceType=t3.micro`);

subheading("Step 3: S3 Stack");
code(`aws cloudformation deploy \\
  --stack-name student-s3 \\
  --template-file 03-s3-bucket.json \\
  --parameter-overrides EnvironmentName=dev BucketNamePrefix=travel237-demo`);

if (doc.y > 700) doc.addPage();

heading("6) Validation Checklist");
bullet("CloudFormation stack status = CREATE_COMPLETE.");
bullet("EC2 has a public IP and instance status checks pass.");
bullet("Opening EC2 Public IP in browser shows Apache test page.");
bullet("S3 bucket exists with versioning enabled.");
bullet("S3 public access block is fully enabled.");

heading("7) Common Troubleshooting");
bullet("S3 bucket name conflict: change BucketNamePrefix parameter.");
bullet("Key pair error: verify KeyPairName exists in selected region.");
bullet("No internet from EC2: verify subnet route table has 0.0.0.0/0 via IGW.");
bullet("SSH blocked: confirm AllowedSshCidr and your local public IP.");

heading("8) Reusability Concepts to Teach");
bullet("Parameters make templates environment-agnostic.");
bullet("Outputs expose values for other stacks.");
bullet("Fn::ImportValue allows stack-to-stack composition.");
bullet("Tagging strategy improves operations and cost tracking.");

heading("9) Cleanup (Avoid Charges)");
body("Delete in reverse dependency order for modular stacks:");
bullet("Delete student-ec2");
bullet("Delete student-s3");
bullet("Delete student-network");
body("For all-in-one mode, delete student-all-in-one only.");

subheading("CLI Cleanup Example");
code(`aws cloudformation delete-stack --stack-name student-all-in-one`);

heading("10) Practice Extensions");
bullet("Add a private EC2 subnet with NAT gateway.");
bullet("Add IAM role for EC2 with least privilege access to S3.");
bullet("Convert to nested stacks.");
bullet("Add CloudWatch alarms for EC2 CPU.");

doc.moveDown(1);
doc.font("Helvetica-Oblique").fontSize(9).fillColor("#666666").text(
  `Prepared by ${instructorName} - ${schoolName}`,
  { align: "center" },
);

doc.end();
