const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const instructorName = "Valery";
const schoolName = "Unixcloudtrainings";

const outputPath = path.join(
  __dirname,
  "CloudFormation_Console_Deployment_Guide_Valery_Unixcloudtrainings.pdf",
);

const doc = new PDFDocument({ margin: 50, size: "A4" });
doc.pipe(fs.createWriteStream(outputPath));

function heading(text) {
  doc.moveDown(0.6);
  doc.font("Helvetica-Bold").fontSize(16).fillColor("#111111").text(text);
  doc.moveDown(0.2);
}

function subheading(text) {
  doc.moveDown(0.35);
  doc.font("Helvetica-Bold").fontSize(12).fillColor("#111111").text(text);
}

function body(text) {
  doc.font("Helvetica").fontSize(10).fillColor("#333333").text(text, { lineGap: 2 });
}

function bullet(text) {
  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#333333")
    .text(`• ${text}`, { indent: 14, lineGap: 2 });
}

doc.font("Helvetica-Bold").fontSize(20).fillColor("#000000").text(
  "CloudFormation Console Deployment Guide",
);
doc.font("Helvetica").fontSize(11).fillColor("#444444").text(
  "How to deploy JSON templates from the AWS Management Console",
);
doc.text(`Instructor: ${instructorName}`);
doc.text(`School: ${schoolName}`);
doc.text(`Generated: ${new Date().toLocaleString()}`);

heading("1) Learning Goal");
body(
  "By the end of this lab, students will be able to deploy, monitor, update, and delete CloudFormation stacks directly from the AWS Console.",
);

heading("2) Files Used in This Lab");
bullet("00-all-in-one.json (single-stack starter)");
bullet("01-vpc-network.json (network layer)");
bullet("02-ec2-instance.json (compute layer)");
bullet("03-s3-bucket.json (storage layer)");

heading("3) Before You Start");
bullet("Sign in to AWS Console with an account that can use CloudFormation, EC2, VPC, and S3.");
bullet("Select one AWS Region and keep all stacks in the same region.");
bullet("Create (or confirm) an EC2 Key Pair in that region (for EC2 SSH access).");
bullet("Have template files downloaded locally on your computer.");

heading("4) Deploy First Stack from Console (All-in-One)");
subheading("Step-by-step");
bullet("Open AWS Console and search for 'CloudFormation'.");
bullet("Click 'Create stack' > 'With new resources (standard)'.");
bullet("In 'Specify template', choose 'Upload a template file'.");
bullet("Upload: 00-all-in-one.json.");
bullet("Click Next.");
bullet("Stack name: student-all-in-one.");
bullet("Fill parameters:");
bullet("  EnvironmentName = dev");
bullet("  KeyPairName = your existing key pair");
bullet("  InstanceType = t3.micro");
bullet("  BucketNamePrefix = travel237-allinone (or your custom prefix)");
bullet("Click Next > Next > Create stack.");

subheading("Monitor Progress");
bullet("In stack Events tab, wait until status becomes CREATE_COMPLETE.");
bullet("If it fails, review the first red failure event for root cause.");

heading("5) Validate Deployed Resources");
bullet("Open Outputs tab in the stack and copy values like InstancePublicIp and BucketName.");
bullet("Go to EC2 > Instances and confirm instance is running.");
bullet("Open the instance public IP in a browser; you should see the demo page.");
bullet("Go to S3 > Buckets and verify the bucket exists.");
bullet("Check bucket properties: Versioning = Enabled, Encryption = Enabled.");

heading("6) Deploy Modular Stacks from Console");
subheading("A) Network Stack");
bullet("Create stack with 01-vpc-network.json.");
bullet("Use stack name: student-network.");
bullet("Set EnvironmentName=dev and desired CIDR ranges.");

subheading("B) EC2 Stack (imports network outputs)");
bullet("Create stack with 02-ec2-instance.json.");
bullet("Use stack name: student-ec2.");
bullet("Set EnvironmentExportPrefix=dev and KeyPairName=your key pair.");

subheading("C) S3 Stack");
bullet("Create stack with 03-s3-bucket.json.");
bullet("Use stack name: student-s3.");
bullet("Set BucketNamePrefix to a globally unique value.");

if (doc.y > 700) doc.addPage();

heading("7) How to Update a Stack in Console");
bullet("Open CloudFormation > select your stack.");
bullet("Click Update.");
bullet("Choose 'Replace current template' and upload updated JSON (if needed).");
bullet("Adjust parameters and click Next > Next > Update stack.");
bullet("Wait for UPDATE_COMPLETE.");

heading("8) How to Troubleshoot Common Console Errors");
bullet("Template format error: validate JSON syntax (missing comma/bracket).");
bullet("S3 bucket name already exists: change BucketNamePrefix.");
bullet("Key pair not found: choose key pair in the correct region.");
bullet("Insufficient permissions: use IAM user/role with required permissions.");
bullet("Resource limit exceeded: check service quotas in that region.");

heading("9) How to Delete Stacks Safely");
body("Delete stacks in dependency order for modular setup:");
bullet("Delete student-ec2 first");
bullet("Delete student-s3 second");
bullet("Delete student-network last");
body("For all-in-one, delete student-all-in-one directly.");

heading("10) Classroom Exercise");
bullet("Task 1: Deploy 00-all-in-one.json from console.");
bullet("Task 2: Validate Outputs and test EC2 public web page.");
bullet("Task 3: Delete stack and redeploy with a different EnvironmentName.");
bullet("Task 4: Deploy modular stacks and compare architecture with all-in-one.");

doc.moveDown(1);
doc.font("Helvetica-Oblique").fontSize(9).fillColor("#666666").text(
  `Prepared for ${schoolName} by ${instructorName}`,
  { align: "center" },
);

doc.end();
