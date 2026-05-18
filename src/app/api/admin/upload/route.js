import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from 'sharp';

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

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    console.log('Upload request - name:', file.name, 'size:', file.size, 'type:', file.type);

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // 生成随机 Public ID 或使用时间戳
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    const publicId = `dragx_${timestamp}_${randomStr}`;

    // 使用 Sharp 将上传的图片转换为 WebP 并压缩
    let webpBuffer;
    try {
      webpBuffer = await sharp(buffer)
        .webp({ quality: 80 })
        .toBuffer();
    } catch (sharpError) {
      console.error('Sharp conversion error:', sharpError.message);
      return NextResponse.json({ 
        error: `图片格式不支持或文件损坏: ${sharpError.message}` 
      }, { status: 400 });
    }

    console.log('Converted to WebP, size:', webpBuffer.length, 'bytes');

    const objectKey = `dragx/dragx/${publicId}.webp`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: objectKey,
      Body: webpBuffer,
      ContentType: "image/webp",
    });

    await s3Client.send(command);

    const r2Url = `https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/${objectKey}`;

    console.log('Upload success:', r2Url);

    return NextResponse.json({
      success: true,
      secure_url: r2Url,
      public_id: publicId
    });

  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
