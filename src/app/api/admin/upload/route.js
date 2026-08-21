import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

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

    console.log('Upload stream request - name:', file.name, 'size:', file.size, 'type:', file.type);

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // 生成随机 Public ID
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    const publicId = `dragx_${timestamp}_${randomStr}`;

    // 智能识别扩展名与 MIME 类型
    let contentType = file.type || 'image/webp';
    let ext = 'webp';

    if (contentType.includes('gif')) {
      ext = 'gif';
    } else if (contentType.includes('png')) {
      ext = 'png';
    } else if (contentType.includes('jpeg') || contentType.includes('jpg')) {
      ext = 'jpg';
    } else if (contentType.includes('svg')) {
      ext = 'svg';
    }

    const objectKey = `dragx/dragx/${publicId}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: objectKey,
      Body: buffer,
      ContentType: contentType,
    });

    await s3Client.send(command);

    const r2Url = `https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/${objectKey}`;

    console.log('Upload success (0 CPU stream):', r2Url);

    return NextResponse.json({
      success: true,
      url: r2Url,
      secure_url: r2Url,
      public_id: publicId
    });

  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
