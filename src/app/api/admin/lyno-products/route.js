import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import pool from '@/lib/db'
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'

const ACCOUNT_ID = "0ec9e4b9094d340d1e3b9530f8a07bcc"
const ACCESS_KEY_ID = "c3137344dab444cc7d472e85a295c86c"
const SECRET_ACCESS_KEY = "040469803914f825110df2e3951566dcbd02d099327bf62443257872262e7417"
const BUCKET_NAME = "dragx"
const R2_PUBLIC_BASE = "https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/"

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
})

// 从 Cloudflare R2 中物理删除旧文件
async function deleteFromR2(url) {
  if (!url || typeof url !== 'string' || !url.includes(R2_PUBLIC_BASE)) return
  try {
    const key = url.replace(R2_PUBLIC_BASE, '')
    await s3Client.send(new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    }))
    console.log('R2 old image deleted:', key)
  } catch (error) {
    console.error('R2 delete error:', error)
  }
}

// 默认预置的 LYNO 数据（当数据库为空时自动导入）
const DEFAULT_LYNO_DATA = [
  // 12.8 INCH
  {
    screen_id: '12.8',
    screen_name: '12.8 INCH',
    screen_image: '/lyno/screen/12.80 INCh.jpg',
    model_id: 'pro-max-12',
    model_name: 'LYNO Quantum Pro Max',
    specs: '12GB+256GB',
    product_image: '/lyno/screen/12.80 INCH 2.jpg',
    sort_order: 10,
    details: {
      'CPU': '8-Core UIS7870 A76 2.7GHz (6nm)',
      'RAM+ROM': '12GB+256GB',
      'Storage': 'UFS (Up to 1700MB/s R, 128GB+)',
      'GPS': 'Dual Band 7 mode (L1 L5 B1 B2a E1 G1 E5a)',
      'MIC': 'Digital Noise Cancelling MIC',
      'USB': 'USB 3.2 Gen1 (Type-C) + USB 2.0 ×3',
      'Audio Chip': 'AKM7739 (DSP, VELVET Audio Technology)',
      'Power Amplifier': 'TDA7808 Digital Enhanced Class AB Power Amplifier',
      'Amplifier Output': '5532 ×3 (Enhanced Audio Signal)',
      'Filter Capacitance': '10000μF',
      'Radio': 'TDA7708 FM/AM',
      'Audio Output': 'Optical + Coaxial + USB DAC + RCA5.1',
      'Bluetooth': 'Qualcomm 3031 (BT 5.0, aptX HD)',
      'System Mode': 'Simplified + Enthusiast Mode\n(supports 3D car models, dynamic wallpaper)',
      'System': 'DXPRO OS',
      'Android Version': '13 (API=33)',
      'Screen': '12.8" → 2400*896',
      'CarPlay/Android Auto': 'Wired + Wireless',
      'Network': '4G LTE external card slot + Wi-Fi',
      'Front & Rear Recording': 'Supported',
      '360° Panorama': 'Supported\n(requires 360 camera)',
      'Voice Control': 'Built-in support'
    }
  },
  {
    screen_id: '12.8',
    screen_name: '12.8 INCH',
    screen_image: '/lyno/screen/12.80 INCh.jpg',
    model_id: 'max-12',
    model_name: 'LYNO Quantum Max',
    specs: '8GB+128GB',
    product_image: '/lyno/screen/12.80 INCH 2.jpg',
    sort_order: 20,
    details: {
      'CPU': '8-Core UIS7870 A76 2.7GHz (6nm)',
      'RAM+ROM': '8GB+128GB',
      'Storage': 'UFS (Up to 1700MB/s R, 128GB+)',
      'GPS': 'Dual Band 7 mode (L1 L5 B1 B2a E1 G1 E5a)',
      'MIC': 'Digital Noise Cancelling MIC',
      'USB': 'USB 3.2 Gen1 (Type-C) + USB 2.0 ×3',
      'Audio Chip': 'AKM7739 (DSP, VELVET Audio Technology)',
      'Power Amplifier': 'TDA7808 Digital Enhanced Class AB Power Amplifier',
      'Amplifier Output': '5532 ×3 (Enhanced Audio Signal)',
      'Filter Capacitance': '10000μF',
      'Radio': 'TDA7708 FM/AM',
      'Audio Output': 'Optical + Coaxial + USB DAC + RCA5.1',
      'Bluetooth': 'Qualcomm 3031 (BT 5.0, aptX HD)',
      'System Mode': 'Simplified + Enthusiast Mode\n(supports 3D car models, dynamic wallpaper)',
      'System': 'DXPRO OS',
      'Android Version': '13 (API=33)',
      'Screen': '12.8" → 2400*896',
      'CarPlay/Android Auto': 'Wired + Wireless',
      'Network': '4G LTE external card slot + Wi-Fi',
      'Front & Rear Recording': 'Supported',
      '360° Panorama': 'Supported\n(requires 360 camera)',
      'Voice Control': 'Built-in support'
    }
  },
  {
    screen_id: '12.8',
    screen_name: '12.8 INCH',
    screen_image: '/lyno/screen/12.80 INCh.jpg',
    model_id: 'max-lite-12',
    model_name: 'LYNO Quantum Lite',
    specs: '6GB+64GB',
    product_image: '/lyno/screen/12.80 INCH 2.jpg',
    sort_order: 30,
    details: {
      'CPU': '8-Core UIS7862S A55 2.0GHz (12nm)',
      'RAM+ROM': '6GB+64GB',
      'Storage': 'EMMC',
      'GPS': '3 mode (L1 E1 G1)',
      'MIC': 'Condenser MIC',
      'USB': 'USB 2.0 ×3',
      'Audio Chip': 'AKM7738 (DSP)',
      'Power Amplifier': 'TDA7850',
      'Amplifier Output': '2582 ×3',
      'Filter Capacitance': '10000μF',
      'Radio': 'TDA7708 FM/AM',
      'Audio Output': 'Optical + Coaxial + USB DAC + RCA5.1',
      'Bluetooth': 'Qualcomm 3031 (BT 5.0, aptX HD)',
      'System Mode': 'Simplified + Enthusiast Mode\n(supports 3D car models, dynamic wallpaper)',
      'System': 'DXPRO OS',
      'Android Version': '10 (API=29)',
      'Screen': '12.8" → 2400*896',
      'CarPlay/Android Auto': 'Wired + Wireless',
      'Network': '4G LTE external card slot + Wi-Fi',
      'Front & Rear Recording': 'Not Supported',
      '360° Panorama': 'Supported\n(requires 360IC + 360 camera)',
      'Voice Control': 'Built-in support'
    }
  },

  // 11.5 INCH
  {
    screen_id: '11.5',
    screen_name: '11.5 INCH',
    screen_image: '/lyno/screen/11.50 INCH.jpg',
    model_id: 'vision-pro-max-11',
    model_name: 'LYNO Vision Pro Max',
    specs: '12GB+256GB',
    product_image: '/lyno/screen/11.50 INCH 2.jpg',
    sort_order: 10,
    details: {
      'CPU': '8-Core UIS7870 A76 2.7GHz (6nm)',
      'RAM+ROM': '12GB+256GB',
      'Storage': 'UFS (Up to 1700MB/s R, 128GB+)',
      'GPS': 'Dual Band 7 mode (L1 L5 B1 B2a E1 G1 E5a)',
      'MIC': 'Digital Noise Cancelling MIC',
      'USB': 'USB 3.2 Gen1 (Type-C) + USB 2.0 ×3',
      'Audio Chip': 'AKM7739 (DSP, VELVET Audio Technology)',
      'Power Amplifier': 'TDA7808 Digital Enhanced Class AB Power Amplifier',
      'Amplifier Output': '5532 ×3 (Enhanced Audio Signal)',
      'Filter Capacitance': '10000μF',
      'Radio': 'TDA7708 FM/AM',
      'Audio Output': 'Optical + Coaxial + USB DAC + RCA5.1',
      'Bluetooth': 'Qualcomm 3031 (BT 5.0, aptX HD)',
      'System Mode': 'Simplified + Enthusiast Mode\n(supports 3D car models, dynamic wallpaper)',
      'System': 'DXPRO OS',
      'Android Version': '13 (API=33)',
      'Screen': '11.5" → 2000*1200',
      'CarPlay/Android Auto': 'Wired + Wireless',
      'Network': '4G LTE external card slot + Wi-Fi',
      'Front & Rear Recording': 'Supported',
      '360° Panorama': 'Supported\n(requires 360 camera)',
      'Voice Control': 'Built-in support'
    }
  },
  {
    screen_id: '11.5',
    screen_name: '11.5 INCH',
    screen_image: '/lyno/screen/11.50 INCH.jpg',
    model_id: 'vision-11',
    model_name: 'LYNO Vision Max',
    specs: '8GB+128GB',
    product_image: '/lyno/screen/11.50 INCH 2.jpg',
    sort_order: 20,
    details: {
      'CPU': '8-Core UIS7870 A76 2.7GHz (6nm)',
      'RAM+ROM': '8GB+128GB',
      'Storage': 'UFS (Up to 1700MB/s R, 128GB+)',
      'GPS': 'Dual Band 7 mode (L1 L5 B1 B2a E1 G1 E5a)',
      'MIC': 'Digital Noise Cancelling MIC',
      'USB': 'USB 3.2 Gen1 (Type-C) + USB 2.0 ×3',
      'Audio Chip': 'AKM7739 (DSP, VELVET Audio Technology)',
      'Power Amplifier': 'TDA7808 Digital Enhanced Class AB Power Amplifier',
      'Amplifier Output': '5532 ×3 (Enhanced Audio Signal)',
      'Filter Capacitance': '10000μF',
      'Radio': 'TDA7708 FM/AM',
      'Audio Output': 'Optical + Coaxial + USB DAC + RCA5.1',
      'Bluetooth': 'Qualcomm 3031 (BT 5.0, aptX HD)',
      'System Mode': 'Simplified + Enthusiast Mode\n(supports 3D car models, dynamic wallpaper)',
      'System': 'DXPRO OS',
      'Android Version': '13 (API=33)',
      'Screen': '11.5" → 2000*1200',
      'CarPlay/Android Auto': 'Wired + Wireless',
      'Network': '4G LTE external card slot + Wi-Fi',
      'Front & Rear Recording': 'Supported',
      '360° Panorama': 'Supported\n(requires 360 camera)',
      'Voice Control': 'Built-in support'
    }
  },
  {
    screen_id: '11.5',
    screen_name: '11.5 INCH',
    screen_image: '/lyno/screen/11.50 INCH.jpg',
    model_id: 'vision-lite-11',
    model_name: 'LYNO Vision Lite',
    specs: '6GB+64GB',
    product_image: '/lyno/screen/11.50 INCH 2.jpg',
    sort_order: 30,
    details: {
      'CPU': '8-Core UIS7862S A55 2.0GHz (12nm)',
      'RAM+ROM': '6GB+64GB',
      'Storage': 'EMMC',
      'GPS': '3 mode (L1 E1 G1)',
      'MIC': 'Condenser MIC',
      'USB': 'USB 2.0 ×3',
      'Audio Chip': 'AKM7738 (DSP)',
      'Power Amplifier': 'TDA7850',
      'Amplifier Output': '2582 ×3',
      'Filter Capacitance': '10000μF',
      'Radio': 'TDA7708 FM/AM',
      'Audio Output': 'Optical + Coaxial + USB DAC + RCA5.1',
      'Bluetooth': 'Qualcomm 3031 (BT 5.0, aptX HD)',
      'System Mode': 'Simplified + Enthusiast Mode\n(supports 3D car models, dynamic wallpaper)',
      'System': 'DXPRO OS',
      'Android Version': '10 (API=29)',
      'Screen': '11.5" → 2000*1200',
      'CarPlay/Android Auto': 'Wired + Wireless',
      'Network': '4G LTE external card slot + Wi-Fi',
      'Front & Rear Recording': 'Not Supported',
      '360° Panorama': 'Supported\n(requires 360IC + 360 camera)',
      'Voice Control': 'Built-in support'
    }
  },

  // 10.36 INCH
  {
    screen_id: '10.36',
    screen_name: '10.36 INCH',
    screen_image: '/lyno/screen/10.36 INCH.jpg',
    model_id: 'air-max-10',
    model_name: 'LYNO OS Pro Max',
    specs: '12GB+256GB',
    product_image: '/lyno/screen/10.36 INCH.jpg',
    sort_order: 10,
    details: {
      'CPU': '8-Core UIS7870 A76 2.7GHz (6nm)',
      'RAM+ROM': '12GB+256GB',
      'Storage': 'UFS (Up to 1700MB/s R, 128GB+)',
      'GPS': 'Dual Band 7 mode (L1 L5 B1 B2a E1 G1 E5a)',
      'MIC': 'Digital Noise Cancelling MIC',
      'USB': 'USB 3.2 Gen1 (Type-C) + USB 2.0 ×3',
      'Audio Chip': 'AKM7739 (DSP, VELVET Audio Technology)',
      'Power Amplifier': 'TDA7808 Digital Enhanced Class AB Power Amplifier',
      'Amplifier Output': '5532 ×3 (Enhanced Audio Signal)',
      'Filter Capacitance': '10000μF',
      'Radio': 'TDA7708 FM/AM',
      'Audio Output': 'Optical + Coaxial + USB DAC + RCA5.1',
      'Bluetooth': 'Qualcomm 3031 (BT 5.0, aptX HD)',
      'System Mode': 'Simplified + Enthusiast Mode\n(supports 3D car models, dynamic wallpaper)',
      'System': 'DXPRO OS',
      'Android Version': '13 (API=33)',
      'Screen': '10.36" → 2000*1200',
      'CarPlay/Android Auto': 'Wired + Wireless',
      'Network': '4G LTE external card slot + Wi-Fi',
      'Front & Rear Recording': 'Supported',
      '360° Panorama': 'Supported\n(requires 360 camera)',
      'Voice Control': 'Built-in support'
    }
  },
  {
    screen_id: '10.36',
    screen_name: '10.36 INCH',
    screen_image: '/lyno/screen/10.36 INCH.jpg',
    model_id: 'air-10',
    model_name: 'LYNO OS Max',
    specs: '8GB+128GB',
    product_image: '/lyno/screen/10.36 INCH.jpg',
    sort_order: 20,
    details: {
      'CPU': '8-Core UIS7870 A76 2.7GHz (6nm)',
      'RAM+ROM': '8GB+128GB',
      'Storage': 'UFS (Up to 1700MB/s R, 128GB+)',
      'GPS': 'Dual Band 7 mode (L1 L5 B1 B2a E1 G1 E5a)',
      'MIC': 'Digital Noise Cancelling MIC',
      'USB': 'USB 3.2 Gen1 (Type-C) + USB 2.0 ×3',
      'Audio Chip': 'AKM7739 (DSP, VELVET Audio Technology)',
      'Power Amplifier': 'TDA7808 Digital Enhanced Class AB Power Amplifier',
      'Amplifier Output': '5532 ×3 (Enhanced Audio Signal)',
      'Filter Capacitance': '10000μF',
      'Radio': 'TDA7708 FM/AM',
      'Audio Output': 'Optical + Coaxial + USB DAC + RCA5.1',
      'Bluetooth': 'Qualcomm 3031 (BT 5.0, aptX HD)',
      'System Mode': 'Simplified + Enthusiast Mode\n(supports 3D car models, dynamic wallpaper)',
      'System': 'DXPRO OS',
      'Android Version': '13 (API=33)',
      'Screen': '10.36" → 2000*1200',
      'CarPlay/Android Auto': 'Wired + Wireless',
      'Network': '4G LTE external card slot + Wi-Fi',
      'Front & Rear Recording': 'Supported',
      '360° Panorama': 'Supported\n(requires 360 camera)',
      'Voice Control': 'Built-in support'
    }
  },
  {
    screen_id: '10.36',
    screen_name: '10.36 INCH',
    screen_image: '/lyno/screen/10.36 INCH.jpg',
    model_id: 'core-10',
    model_name: 'LYNO OS Lite',
    specs: '4GB+64GB',
    product_image: '/lyno/screen/10.36 INCH.jpg',
    sort_order: 30,
    details: {
      'CPU': '8-Core UIS7862S A55 2.0GHz (12nm)',
      'RAM+ROM': '4GB+64GB',
      'Storage': 'EMMC',
      'GPS': '3 mode (L1 E1 G1)',
      'MIC': 'Condenser MIC',
      'USB': 'USB 2.0 ×3',
      'Audio Chip': 'AKM7738 (DSP)',
      'Power Amplifier': 'TDA7850',
      'Amplifier Output': '2582 ×3',
      'Filter Capacitance': '10000μF',
      'Radio': 'TDA7708 FM/AM',
      'Audio Output': 'Optical + Coaxial + USB DAC + RCA5.1',
      'Bluetooth': 'Qualcomm 3031 (BT 5.0, aptX HD)',
      'System Mode': 'Simplified + Enthusiast Mode\n(supports 3D car models, dynamic wallpaper)',
      'System': 'DXPRO OS',
      'Android Version': '10 (API=29)',
      'Screen': '10.36" → 2000*1200',
      'CarPlay/Android Auto': 'Wired + Wireless',
      'Network': '4G LTE external card slot + Wi-Fi',
      'Front & Rear Recording': 'Not Supported',
      '360° Panorama': 'Supported\n(requires 360IC + 360 camera)',
      'Voice Control': 'Built-in support'
    }
  },

  // 9.5 INCH
  {
    screen_id: '9.5',
    screen_name: '9.5 INCH',
    screen_image: '/lyno/screen/9.5 INCH.jpg',
    model_id: 'air-max-9',
    model_name: 'LYNO OS Pro Max',
    specs: '12GB+256GB',
    product_image: '/lyno/screen/9.5 INCH.jpg',
    sort_order: 10,
    details: {
      'CPU': '8-Core UIS7870 A76 2.7GHz (6nm)',
      'RAM+ROM': '12GB+256GB',
      'Storage': 'UFS (Up to 1700MB/s R, 128GB+)',
      'GPS': 'Dual Band 7 mode (L1 L5 B1 B2a E1 G1 E5a)',
      'MIC': 'Digital Noise Cancelling MIC',
      'USB': 'USB 3.2 Gen1 (Type-C) + USB 2.0 ×3',
      'Audio Chip': 'AKM7739 (DSP, VELVET Audio Technology)',
      'Power Amplifier': 'TDA7808 Digital Enhanced Class AB Power Amplifier',
      'Amplifier Output': '5532 ×3 (Enhanced Audio Signal)',
      'Filter Capacitance': '10000μF',
      'Radio': 'TDA7708 FM/AM',
      'Audio Output': 'Optical + Coaxial + USB DAC + RCA5.1',
      'Bluetooth': 'Qualcomm 3031 (BT 5.0, aptX HD)',
      'System Mode': 'Simplified + Enthusiast Mode\n(supports 3D car models, dynamic wallpaper)',
      'System': 'DXPRO OS',
      'Android Version': '13 (API=33)',
      'Screen': '9.5" → 2000*1200',
      'CarPlay/Android Auto': 'Wired + Wireless',
      'Network': '4G LTE external card slot + Wi-Fi',
      'Front & Rear Recording': 'Supported',
      '360° Panorama': 'Supported\n(requires 360 camera)',
      'Voice Control': 'Built-in support'
    }
  },
  {
    screen_id: '9.5',
    screen_name: '9.5 INCH',
    screen_image: '/lyno/screen/9.5 INCH.jpg',
    model_id: 'air-9',
    model_name: 'LYNO OS Max',
    specs: '8GB+128GB',
    product_image: '/lyno/screen/9.5 INCH.jpg',
    sort_order: 20,
    details: {
      'CPU': '8-Core UIS7870 A76 2.7GHz (6nm)',
      'RAM+ROM': '8GB+128GB',
      'Storage': 'UFS (Up to 1700MB/s R, 128GB+)',
      'GPS': 'Dual Band 7 mode (L1 L5 B1 B2a E1 G1 E5a)',
      'MIC': 'Digital Noise Cancelling MIC',
      'USB': 'USB 3.2 Gen1 (Type-C) + USB 2.0 ×3',
      'Audio Chip': 'AKM7739 (DSP, VELVET Audio Technology)',
      'Power Amplifier': 'TDA7808 Digital Enhanced Class AB Power Amplifier',
      'Amplifier Output': '5532 ×3 (Enhanced Audio Signal)',
      'Filter Capacitance': '10000μF',
      'Radio': 'TDA7708 FM/AM',
      'Audio Output': 'Optical + Coaxial + USB DAC + RCA5.1',
      'Bluetooth': 'Qualcomm 3031 (BT 5.0, aptX HD)',
      'System Mode': 'Simplified + Enthusiast Mode\n(supports 3D car models, dynamic wallpaper)',
      'System': 'DXPRO OS',
      'Android Version': '13 (API=33)',
      'Screen': '9.5" → 2000*1200',
      'CarPlay/Android Auto': 'Wired + Wireless',
      'Network': '4G LTE external card slot + Wi-Fi',
      'Front & Rear Recording': 'Supported',
      '360° Panorama': 'Supported\n(requires 360 camera)',
      'Voice Control': 'Built-in support'
    }
  },
  {
    screen_id: '9.5',
    screen_name: '9.5 INCH',
    screen_image: '/lyno/screen/9.5 INCH.jpg',
    model_id: 'core-9',
    model_name: 'LYNO OS Lite',
    specs: '4GB+64GB',
    product_image: '/lyno/screen/9.5 INCH.jpg',
    sort_order: 30,
    details: {
      'CPU': '8-Core UIS7862S A55 2.0GHz (12nm)',
      'RAM+ROM': '4GB+64GB',
      'Storage': 'EMMC',
      'GPS': '3 mode (L1 E1 G1)',
      'MIC': 'Condenser MIC',
      'USB': 'USB 2.0 ×3',
      'Audio Chip': 'AKM7738 (DSP)',
      'Power Amplifier': 'TDA7850',
      'Amplifier Output': '2582 ×3',
      'Filter Capacitance': '10000μF',
      'Radio': 'TDA7708 FM/AM',
      'Audio Output': 'Optical + Coaxial + USB DAC + RCA5.1',
      'Bluetooth': 'Qualcomm 3031 (BT 5.0, aptX HD)',
      'System Mode': 'Simplified + Enthusiast Mode\n(supports 3D car models, dynamic wallpaper)',
      'System': 'DXPRO OS',
      'Android Version': '10 (API=29)',
      'Screen': '9.5" → 2000*1200',
      'CarPlay/Android Auto': 'Wired + Wireless',
      'Network': '4G LTE external card slot + Wi-Fi',
      'Front & Rear Recording': 'Not Supported',
      '360° Panorama': 'Supported\n(requires 360IC + 360 camera)',
      'Voice Control': 'Built-in support'
    }
  }
]

// 确保表存在并自动导入默认数据
async function ensureSchema(connection) {
  try {
    // 1. 创建 lyno_screens 独立屏幕尺寸表（确保屏幕即使没有型号也不会被意外删除）
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS lyno_screens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        screen_id VARCHAR(50) NOT NULL UNIQUE,
        screen_name VARCHAR(100) NOT NULL,
        screen_image TEXT,
        sort_order INT DEFAULT 10,
        is_active TINYINT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)

    // 2. 创建 lyno_products 型号与技术参数表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS lyno_products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        screen_id VARCHAR(50) NOT NULL,
        screen_name VARCHAR(100) NOT NULL,
        screen_image TEXT,
        model_id VARCHAR(100) NOT NULL,
        model_name VARCHAR(200) NOT NULL,
        specs VARCHAR(100) DEFAULT '',
        product_image TEXT,
        details LONGTEXT,
        sort_order INT DEFAULT 0,
        is_active TINYINT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_screen (screen_id),
        INDEX idx_model (model_id)
      )
    `)

    // 检查表内是否有数据，若为空则自动预置默认数据
    const [rows] = await connection.execute(`SELECT COUNT(*) as count FROM lyno_products`)
    if (rows[0].count === 0) {
      console.log('Seeding initial LYNO products into database...')
      for (const item of DEFAULT_LYNO_DATA) {
        await connection.execute(`
          INSERT INTO lyno_products (
            screen_id, screen_name, screen_image,
            model_id, model_name, specs, product_image,
            details, sort_order, is_active
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
        `, [
          item.screen_id,
          item.screen_name,
          item.screen_image,
          item.model_id,
          item.model_name,
          item.specs,
          item.product_image,
          JSON.stringify(item.details),
          item.sort_order
        ])
      }
    }

    // 自动同步现有屏幕到 lyno_screens
    await connection.execute(`
      INSERT IGNORE INTO lyno_screens (screen_id, screen_name, screen_image, sort_order)
      SELECT screen_id, screen_name, screen_image, MIN(sort_order)
      FROM lyno_products
      GROUP BY screen_id, screen_name, screen_image
    `)
  } catch (err) {
    console.error('Error ensuring lyno_products schema:', err)
  }
}

// GET: 获取所有 LYNO 屏幕与产品数据
export async function GET() {
  try {
    const connection = await pool.getConnection()
    try {
      await ensureSchema(connection)

      // 1. 获取所有独立屏幕
      const [screenRows] = await connection.execute(`
        SELECT * FROM lyno_screens WHERE is_active = 1 ORDER BY sort_order ASC, id ASC
      `)

      // 2. 获取所有型号产品
      const [rows] = await connection.execute(`
        SELECT * FROM lyno_products WHERE is_active = 1 ORDER BY sort_order ASC, id ASC
      `)

      const screenSizes = []
      const productOptions = {}
      const productDetails = {}

      // 初始化屏幕列表
      screenRows.forEach(s => {
        screenSizes.push({
          id: s.screen_id,
          name: s.screen_name,
          image: s.screen_image
        })
        productOptions[s.screen_id] = []
      })

      // 填充型号与参数
      rows.forEach(row => {
        let parsedDetails = {}
        try {
          parsedDetails = typeof row.details === 'string' ? JSON.parse(row.details) : (row.details || {})
        } catch (e) {
          parsedDetails = {}
        }

        // 如果该屏幕尺寸尚未在 screenSizes 中（兜底保护），则加入
        if (!productOptions[row.screen_id]) {
          productOptions[row.screen_id] = []
          if (!screenSizes.some(s => s.id === row.screen_id)) {
            screenSizes.push({
              id: row.screen_id,
              name: row.screen_name,
              image: row.screen_image
            })
          }
        }

        productOptions[row.screen_id].push({
          db_id: row.id,
          id: row.model_id,
          name: row.model_name,
          specs: row.specs,
          image: row.product_image,
          sort_order: row.sort_order
        })

        productDetails[row.model_id] = {
          db_id: row.id,
          screen_id: row.screen_id,
          name: row.model_name,
          specs: row.specs,
          image: row.product_image,
          details: parsedDetails
        }
      })

      return NextResponse.json({
        success: true,
        items: rows,
        screenSizes,
        productOptions,
        productDetails
      })
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error('Error fetching lyno products:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// POST: 添加或更新 LYNO 产品 / 屏幕
export async function POST(req) {
  try {
    const body = await req.json()
    const {
      action, // 'save_product', 'update_screen', 'delete_product', 'delete_screen', 'add_screen', 'reorder'
      id, // db_id
      screen_id,
      screen_name,
      screen_image,
      model_id,
      model_name,
      specs,
      product_image,
      details,
      sort_order
    } = body

    const connection = await pool.getConnection()
    try {
      await ensureSchema(connection)

      if (action === 'save_product') {
        const detailsJson = JSON.stringify(details || {})
        if (id) {
          // 查找旧图片并清理旧照片
          const [oldRows] = await connection.execute(`SELECT product_image FROM lyno_products WHERE id = ?`, [id])
          if (oldRows.length > 0 && oldRows[0].product_image && oldRows[0].product_image !== product_image) {
            await deleteFromR2(oldRows[0].product_image)
          }

          // Update existing product
          await connection.execute(`
            UPDATE lyno_products SET
              screen_id = ?,
              screen_name = ?,
              screen_image = ?,
              model_id = ?,
              model_name = ?,
              specs = ?,
              product_image = ?,
              details = ?,
              sort_order = ?
            WHERE id = ?
          `, [
            screen_id,
            screen_name || `${screen_id} INCH`,
            screen_image || '',
            model_id,
            model_name,
            specs || '',
            product_image || '',
            detailsJson,
            sort_order !== undefined ? Number(sort_order) : 10,
            id
          ])
        } else {
          // Insert new product
          await connection.execute(`
            INSERT INTO lyno_products (
              screen_id, screen_name, screen_image,
              model_id, model_name, specs, product_image,
              details, sort_order, is_active
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
          `, [
            screen_id,
            screen_name || `${screen_id} INCH`,
            screen_image || '',
            model_id || `model-${Date.now()}`,
            model_name,
            specs || '',
            product_image || '',
            detailsJson,
            sort_order !== undefined ? Number(sort_order) : 10
          ])
        }
      } else if (action === 'update_screen') {
        // 查找旧 screen_image 并清理旧照片
        const [oldRows] = await connection.execute(`SELECT screen_image FROM lyno_screens WHERE screen_id = ? LIMIT 1`, [screen_id])
        if (oldRows.length > 0 && oldRows[0].screen_image && oldRows[0].screen_image !== screen_image) {
          await deleteFromR2(oldRows[0].screen_image)
        }

        // 更新 lyno_screens
        await connection.execute(`
          UPDATE lyno_screens SET
            screen_name = ?,
            screen_image = ?
          WHERE screen_id = ?
        `, [screen_name, screen_image, screen_id])

        // 同步更新 lyno_products 内部冗余数据
        await connection.execute(`
          UPDATE lyno_products SET
            screen_name = ?,
            screen_image = ?
          WHERE screen_id = ?
        `, [screen_name, screen_image, screen_id])
      } else if (action === 'add_screen') {
        // 在 lyno_screens 表中独立创建屏幕尺寸（不需要强行绑定假型号）
        const newScreenId = screen_id || `screen-${Date.now()}`
        const newScreenName = screen_name || `${newScreenId} INCH`
        
        await connection.execute(`
          INSERT INTO lyno_screens (
            screen_id, screen_name, screen_image, sort_order, is_active
          ) VALUES (?, ?, ?, 10, 1)
          ON DUPLICATE KEY UPDATE screen_name = VALUES(screen_name), screen_image = VALUES(screen_image)
        `, [
          newScreenId,
          newScreenName,
          screen_image || ''
        ])
      } else if (action === 'delete_product') {
        // 清理产品图片
        const [oldRows] = await connection.execute(`SELECT product_image FROM lyno_products WHERE id = ?`, [id])
        if (oldRows.length > 0 && oldRows[0].product_image) {
          await deleteFromR2(oldRows[0].product_image)
        }
        // 仅从 lyno_products 中删除该型号，屏幕尺寸依然在 lyno_screens 中保留！
        await connection.execute(`DELETE FROM lyno_products WHERE id = ?`, [id])
      } else if (action === 'delete_screen') {
        // 彻底删除整个屏幕尺寸及其下的所有型号
        const [oldRows] = await connection.execute(`SELECT screen_image, product_image FROM lyno_products WHERE screen_id = ?`, [screen_id])
        for (const row of oldRows) {
          if (row.screen_image) await deleteFromR2(row.screen_image)
          if (row.product_image) await deleteFromR2(row.product_image)
        }

        const [screenRows] = await connection.execute(`SELECT screen_image FROM lyno_screens WHERE screen_id = ?`, [screen_id])
        for (const s of screenRows) {
          if (s.screen_image) await deleteFromR2(s.screen_image)
        }

        await connection.execute(`DELETE FROM lyno_screens WHERE screen_id = ?`, [screen_id])
        await connection.execute(`DELETE FROM lyno_products WHERE screen_id = ?`, [screen_id])
      }

      revalidatePath('/lyno')
      revalidatePath('/admin/products/lyno')

      return NextResponse.json({ success: true })
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error('Error saving lyno product:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
