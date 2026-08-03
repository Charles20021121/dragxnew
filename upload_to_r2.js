const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require('fs');
const path = require('path');

const ACCOUNT_ID = "0ec9e4b9094d340d1e3b9530f8a07bcc"; 
const ACCESS_KEY_ID = "c3137344dab444cc7d472e85a295c86c";
const SECRET_ACCESS_KEY = "040469803914f825110df2e3951566dcbd02d099327bf62443257872262e7417";
const BUCKET_NAME = "dragx";

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

async function uploadDir(dirPath, basePath) {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      await uploadDir(fullPath, basePath);
    } else {
      const ext = path.extname(fullPath).toLowerCase();
      let contentType = 'application/octet-stream';
      if (ext === '.webp') contentType = 'image/webp';
      else if (ext === '.png') contentType = 'image/png';
      else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';

      const relativePath = path.relative(basePath, fullPath).replace(/\\/g, '/');
      const objectKey = `dragx/dragx/ambientlight/${relativePath}`;

      console.log(`Uploading ${relativePath} to ${objectKey}...`);
      
      const fileStream = fs.readFileSync(fullPath);
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: objectKey,
        Body: fileStream,
        ContentType: contentType,
      });

      try {
        await s3Client.send(command);
        console.log(`Success: ${objectKey}`);
      } catch (err) {
        console.error(`Failed: ${objectKey}`, err);
      }
    }
  }
}

const targetDir = path.join(__dirname, 'public', 'ambientlight');
uploadDir(targetDir, targetDir).then(() => console.log('Done'));
