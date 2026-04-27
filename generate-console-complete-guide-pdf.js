const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const instructorName = "Valery";
const schoolName = "Unixcloudtrainings";

const outputPath = path.join(
  __dirname,
  "CloudFormation_Console_Full_Guide_v2_Valery_Unixcloudtrainings.pdf",
);

const doc = new PDFDocument({ margin: 50, size: "A4" });
doc.pipe(fs.createWriteStream(outputPath));

function heading(text) {
  doc.moveDown(0.7);
  doc.font("Helvetica-Bold").fontSize(16).fillColor("#111111").text(text);
  doc.moveDown(0.2);
}

function subheading(text) {
  doc.moveDown(0.4);
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

function code(text) {
  doc.moveDown(0.2);
  doc.font("Courier").fontSize(9).fillColor("#222222").text(text, {
    lineGap: 1.5,
    indent: 12,
  });
  doc.moveDown(0.2);
}

function ensurePageSpace(minBottom = 140) {
  if (doc.y > doc.page.height - minBottom) {
    doc.addPage();
  }
}

doc.font("Helvetica-Bold").fontSize(20).fillColor("#000000").text(
  "CloudFormation Console Full Guide (v2)",
);
doc.font("Helvetica").fontSize(11).fillColor("#444444").text(
  "How to use AWS CloudFormation from the AWS Management Console",
);
doc.text(`Instructor: ${instructorName}`);
doc.text(`School: ${schoolName}`);
doc.text(`Generated: ${new Date().toLocaleString()}`);

heading("1) What is CloudFormation?");
body(
  "AWS CloudFormation is an Infrastructure as Code (IaC) service that lets you define AWS resources in a template (JSON or YAML) and deploy them as a managed unit called a stack.",
);
bullet("Template: the code (JSON/YAML) describing resources.");
bullet("Stack: a deployed instance of a template.");
bullet("Parameters: runtime inputs to make templates reusable.");
bullet("Outputs: values returned after deployment (for reuse).");
bullet("Events: real-time deployment/update/delete logs.");

ensurePageSpace();
heading("2) CloudFormation Console Tour");
bullet("Stacks: list of all stacks in selected region.");
bullet("Events tab: detailed operation timeline and errors.");
bullet("Resources tab: actual created AWS resources.");
bullet("Outputs tab: exported values (IDs, ARNs, endpoints).");
bullet("Template tab: currently deployed template.");
bullet("Drift tab: configuration drift checks.");
bullet("Change sets: preview updates before execution.");

ensurePageSpace();
heading("3) Create a Stack in Console");
subheading("Step-by-step");
bullet("Open AWS Console > search CloudFormation.");
bullet("Click Create stack > With new resources (standard).");
bullet("Specify template: Upload template file.");
bullet("Choose JSON file (example: 00-all-in-one.json).");
bullet("Enter stack name (example: student-all-in-one).");
bullet("Fill parameters (EnvironmentName, KeyPairName, etc.).");
bullet("Leave defaults for options unless your lab requires tags/permissions.");
bullet("Review and click Submit/Create stack.");
bullet("Monitor Events until status is CREATE_COMPLETE.");

ensurePageSpace();
heading("4) Validate Before Deploying");
bullet("Use CloudFormation template validation in Console (if available).");
bullet("Review JSON structure: commas, brackets, property names.");
bullet("Check parameter constraints and AllowedValues.");
bullet("Confirm region-specific resources exist (KeyPair, AMI, etc.).");
bullet("For S3, ensure generated bucket name will be globally unique.");

ensurePageSpace();
heading("5) Update an Existing Stack");
bullet("Open stack > click Update.");
bullet("Choose Replace current template or Use current template.");
bullet("Adjust parameters (e.g., instance type).");
bullet("Review and submit.");
bullet("Wait for UPDATE_COMPLETE.");

subheading("Recommended teaching demo");
bullet("Change EC2 InstanceType from t3.micro to t3.small.");
bullet("Observe update behavior in Events.");

ensurePageSpace();
heading("6) Change Sets (Safe Update Preview)");
body(
  "Change sets let you preview what CloudFormation will modify before executing updates.",
);
bullet("From stack actions, create change set.");
bullet("Upload updated template / parameters.");
bullet("Review resource actions: Add / Modify / Replace / Remove.");
bullet("Execute change set only after review.");

ensurePageSpace();
heading("7) Drift Detection");
body(
  "Drift detection compares deployed stack resources with template definitions to find manual changes made outside CloudFormation.",
);
bullet("Open stack > Actions > Detect drift.");
bullet("Review drift status for each resource.");
bullet("Use drift findings for governance and remediation exercises.");

ensurePageSpace();
heading("8) Troubleshooting Failed Deployments");
bullet("Always check the first failed Event in red.");
bullet("Common issues:");
bullet("  - Missing permissions (IAM).");
bullet("  - Resource already exists (e.g., S3 bucket name conflict).");
bullet("  - Invalid parameter value.");
bullet("  - Regional mismatch (KeyPair not in region).");
bullet("Rollback behavior:");
bullet("  - CREATE_FAILED often rolls back automatically.");
bullet("  - You can inspect events to find exact failing resource.");

ensurePageSpace();
heading("9) Best Practices for Students");
bullet("Use Parameters for environment portability.");
bullet("Use Outputs to connect stacks.");
bullet("Tag every resource (Name, Environment, Owner).");
bullet("Prefer small modular templates for production.");
bullet("Use all-in-one templates for beginner labs and demos.");
bullet("Always clean up lab stacks to avoid charges.");

ensurePageSpace();
heading("10) Hands-On Classroom Lab Plan");
subheading("Lab A - Beginner");
bullet("Deploy 00-all-in-one.json from console.");
bullet("Validate EC2 web page and S3 bucket settings.");
bullet("Delete stack and redeploy with new EnvironmentName.");

subheading("Lab B - Intermediate");
bullet("Deploy network stack first (01-vpc-network.json).");
bullet("Deploy EC2 stack (02-ec2-instance.json) using imports.");
bullet("Deploy S3 stack (03-s3-bucket.json).");
bullet("Run change set and drift detection exercises.");

ensurePageSpace();
heading("11) Cleanup and Cost Control");
bullet("Delete in dependency order for modular labs:");
bullet("  1) student-ec2");
bullet("  2) student-s3");
bullet("  3) student-network");
bullet("For all-in-one: delete student-all-in-one.");
bullet("Verify resources are deleted in EC2, VPC, and S3 consoles.");

subheading("Optional CLI cleanup reference");
code(`aws cloudformation delete-stack --stack-name student-all-in-one`);

doc.moveDown(1);
doc.font("Helvetica-Oblique").fontSize(9).fillColor("#666666").text(
  `Prepared for ${schoolName} by ${instructorName}`,
  { align: "center" },
);

doc.end();
