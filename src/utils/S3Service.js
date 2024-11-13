import AWS from "aws-sdk";
import fs from "fs";
import path from "path";

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AZ_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

// Helper function to get the content type based on the file extension
const getContentType = (fileName) => {
  const ext = path.extname(fileName).toLowerCase();

  // Handle image files
  if (ext === ".jpg" || ext === ".jpeg") {
    return "image/jpeg";
  } else if (ext === ".png") {
    return "image/png";
  } else if (ext === ".gif") {
    return "image/gif";
  } else if (ext === ".bmp") {
    return "image/bmp";
  } else if (ext === ".webp") {
    return "image/webp";

    // Handle document files
  } else if (ext === ".pdf") {
    return "application/pdf";
  } else if (ext === ".doc" || ext === ".docx") {
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  } else if (ext === ".xls" || ext === ".xlsx") {
    return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  } else if (ext === ".ppt" || ext === ".pptx") {
    return "application/vnd.openxmlformats-officedocument.presentationml.presentation";

    // Default for unknown file types
  } else {
    return "application/octet-stream";
  }
};

// Upload function
const uploadToS3 = async (fileBuffer, fileName) => {
  // Get content type dynamically based on file extension
  const contentType = getContentType(fileName);

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `uploads/${Date.now()}-${fileName}`, // You can customize the file path if needed
    Body: fileBuffer,
    ContentType: contentType, // Set the appropriate content type based on file extension
  };

  // Upload the file to S3
  try {
    const data = await s3.upload(params).promise();
    return data; // Return the response from S3 after uploading
  } catch (error) {
    throw new Error(`Error uploading file to S3: ${error.message}`);
  }
};

export { uploadToS3 };
