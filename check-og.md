# 快速检查 Open Graph 的方法

## 方法 1: 查看页面源代码

1. 访问产品页面：
   ```
   https://9c4e421d5055.ngrok-free.app/products/androidplayer/android-player-dxpro-luxury-series-8
   ```

2. 右键 → "查看页面源代码" (或按 Ctrl+U)

3. 搜索 `og:image` (按 Ctrl+F)

4. 你应该看到类似这样的内容：
   ```html
   <meta property="og:image" content="https://res.cloudinary.com/dmkxx68km/image/upload/v1725611928/ukzmrw5nzcsovbnb31nd.webp"/>
   <meta property="og:url" content="https://9c4e421d5055.ngrok-free.app/products/androidplayer/android-player-dxpro-luxury-series-8"/>
   ```

## 方法 2: 使用浏览器开发者工具

1. 按 F12 打开开发者工具
2. 切换到 "Elements" 或 "元素" 标签
3. 在 `<head>` 标签中搜索 `og:image`

## 方法 3: 使用 curl 命令

在终端运行：
```bash
curl -s https://9c4e421d5055.ngrok-free.app/products/androidplayer/android-player-dxpro-luxury-series-8 | grep "og:image"
```

## 关键检查点

### ✅ 正确的 Open Graph 标签应该是：

```html
<meta property="og:type" content="website"/>
<meta property="og:url" content="https://9c4e421d5055.ngrok-free.app/products/androidplayer/android-player-dxpro-luxury-series-8"/>
<meta property="og:title" content="Android Player Dxpro Luxury Series 8 - Android Player | DRAGX Car Accessories"/>
<meta property="og:description" content="Discover the Android Player Dxpro Luxury Series 8 from our Android Player collection"/>
<meta property="og:site_name" content="DRAGX Car Accessories"/>
<meta property="og:locale" content="en_US"/>
<meta property="og:image" content="https://res.cloudinary.com/dmkxx68km/image/upload/v1725611928/ukzmrw5nzcsovbnb31nd.webp"/>
<meta property="og:image:width" content="1200"/>
<meta property="og:image:height" content="630"/>
<meta property="og:image:alt" content="Android Player Dxpro Luxury Series 8 - Android Player"/>
<meta property="og:image:type" content="image/jpeg"/>
```

### ❌ 错误的情况：

1. **URL 是相对路径：**
   ```html
   <meta property="og:image" content="/images/product.jpg"/>
   ```

2. **URL 指向错误的域名：**
   ```html
   <meta property="og:url" content="https://dragx.asia/..."/>
   ```
   应该是：
   ```html
   <meta property="og:url" content="https://9c4e421d5055.ngrok-free.app/..."/>
   ```

3. **缺少必要的标签：**
   - 缺少 `og:type`
   - 缺少 `og:url`
   - 缺少 `og:image`

## 如果发现问题

### 问题 1: 服务器没有重启
**症状：** `og:url` 还是显示 `https://dragx.asia`

**解决：**
```bash
# 停止服务器 (Ctrl+C)
npm run dev
```

### 问题 2: 环境变量没有生效
**症状：** 页面源代码中的 URL 不对

**检查：**
```bash
# 在项目根目录运行
cat .env.local | grep NEXT_PUBLIC_BASE_URL
```

应该显示：
```
NEXT_PUBLIC_BASE_URL=https://9c4e421d5055.ngrok-free.app
```

### 问题 3: Next.js 缓存问题
**解决：**
```bash
# 删除 .next 文件夹
rm -rf .next
# 或者在 Windows PowerShell:
Remove-Item -Recurse -Force .next

# 重新启动
npm run dev
```

## 请把以下信息发给我：

1. **页面源代码中的 og:image 标签**
   - 复制完整的 `<meta property="og:image" ...>` 行

2. **页面源代码中的 og:url 标签**
   - 复制完整的 `<meta property="og:url" ...>` 行

3. **调试页面的截图**
   - 访问 https://9c4e421d5055.ngrok-free.app/debug-og
   - 截图整个页面

这样我就能准确知道问题在哪里了！

