/**
 * 客户端图片压缩与上传工具
 * 在浏览器端使用 Canvas 将图片转码为高质量 WebP 并压缩，彻底卸载服务器 CPU 负担
 */

export async function compressImage(file, options = {}) {
  if (!file) return file;

  // 1. 如果不是图片，或是 GIF 动图 / SVG 矢量图，保持原样不处理
  if (
    !file.type ||
    !file.type.startsWith('image/') ||
    file.type === 'image/gif' ||
    file.type === 'image/svg+xml'
  ) {
    return file;
  }

  // 2. 如果在服务端（SSR），直接返回
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return file;
  }

  const {
    maxWidth = 2560,
    maxHeight = 2560,
    quality = 0.85,
  } = options;

  return new Promise((resolve) => {
    try {
      const objectUrl = URL.createObjectURL(file);
      const img = new Image();

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);

        let { width, height } = img;

        // 等比例缩放（如果原图超过最大尺寸）
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(file); // 降级处理
        }

        // 绘制图像并导出 WebP
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return resolve(file);
            }

            const cleanName = (file.name || 'image').replace(/\.[^/.]+$/, '');
            const compressedFile = new File([blob], `${cleanName}.webp`, {
              type: 'image/webp',
              lastModified: Date.now(),
            });

            resolve(compressedFile);
          },
          'image/webp',
          quality
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(file); // 读取失败回退
      };

      img.src = objectUrl;
    } catch (err) {
      console.warn('Frontend image compression error, falling back to raw file:', err);
      resolve(file);
    }
  });
}

/**
 * 统一前端上传函数：自动完成客户端压缩后上传至 /api/admin/upload
 */
export async function uploadAdminImage(file, options = {}) {
  if (!file) {
    throw new Error('No file provided for upload');
  }

  // 1. 客户端秒级压缩
  const processedFile = await compressImage(file, options);

  // 2. 发送至后台存储
  const formData = new FormData();
  formData.append('file', processedFile);

  const res = await fetch('/api/admin/upload', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to upload image');
  }

  return data;
}
