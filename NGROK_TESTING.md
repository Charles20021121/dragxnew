# 使用 ngrok 测试 Open Graph 图片预览

## 问题说明
手机版 WhatsApp 不显示产品链接的图片预览，但桌面版可以显示。

## 解决方案
已更新代码以支持动态 base URL，可以在 ngrok 环境下测试 Open Graph 标签。

---

## 🚀 快速开始

### 步骤 1: 启动开发服务器
```bash
npm run dev
```
服务器会在 `http://localhost:3005` 运行

### 步骤 2: 启动 ngrok
在新的终端窗口：
```bash
ngrok http 3005
```

你会看到类似这样的输出：
```
Forwarding  https://abc123.ngrok.io -> http://localhost:3005
```

### 步骤 3: 更新环境变量

**方法 A - 使用脚本（推荐）：**
```bash
node update-ngrok-url.js https://abc123.ngrok.io
```

**方法 B - 手动编辑：**
编辑 `.env.local` 文件：
```env
NEXT_PUBLIC_BASE_URL=https://abc123.ngrok.io
```

### 步骤 4: 重启开发服务器
```bash
# 停止当前服务器 (Ctrl+C)
npm run dev
```

### 步骤 5: 测试 Open Graph

#### 5.1 查看页面源代码
访问产品页面：
```
https://abc123.ngrok.io/products/androidplayer/android-player-dxpro-luxury-series-8
```

右键 → "查看页面源代码"，搜索 `og:image`，应该看到：
```html
<meta property="og:image" content="https://res.cloudinary.com/...">
<meta property="og:url" content="https://abc123.ngrok.io/products/...">
<meta property="og:type" content="website">
<meta property="og:title" content="Android Player DXPro Luxury Series 8 - Android Player | DRAGX Car Accessories">
```

#### 5.2 使用 Facebook Debugger
1. 访问：https://developers.facebook.com/tools/debug/
2. 输入你的 ngrok URL
3. 点击 "Debug"
4. 检查是否显示正确的图片和信息

#### 5.3 在 WhatsApp 中测试
1. 复制 ngrok URL
2. 发送到 WhatsApp（可以发给自己或测试群组）
3. 等待 10-30 秒让 WhatsApp 抓取预览
4. 应该会看到产品图片和描述

---

## 🔧 故障排除

### 问题 1: WhatsApp 不显示图片
**解决方法：**
- 等待 30 秒后重试
- 在 URL 后面加 `?v=1` 强制刷新：
  ```
  https://abc123.ngrok.io/products/androidplayer/android-player-dxpro-luxury-series-8?v=1
  ```
- 使用 Facebook Debugger 的 "Scrape Again" 按钮清除缓存

### 问题 2: 图片 URL 不正确
**检查：**
1. 查看页面源代码中的 `og:image` 标签
2. 确保图片 URL 是完整的 HTTPS URL
3. 在浏览器中直接访问图片 URL，确认可以打开

### 问题 3: ngrok URL 变化了
**解决方法：**
每次 ngrok 重启，URL 都会变化（免费版）。需要：
1. 复制新的 ngrok URL
2. 运行 `node update-ngrok-url.js https://new-url.ngrok.io`
3. 重启开发服务器

### 问题 4: 修改后没有生效
**解决方法：**
1. 确保已重启 Next.js 开发服务器
2. 清除浏览器缓存
3. 使用隐私/无痕模式测试

---

## 📱 测试清单

在部署到生产环境前，确保：

- [ ] 在 Facebook Debugger 中测试通过
- [ ] 在桌面版 WhatsApp 中可以看到预览
- [ ] 在手机版 WhatsApp 中可以看到预览
- [ ] 图片清晰，尺寸合适（1200x630）
- [ ] 标题和描述正确显示
- [ ] 测试至少 3 个不同的产品页面

---

## 🚀 部署到生产环境

### 步骤 1: 清除测试配置
编辑 `.env.local`，删除或注释掉 `NEXT_PUBLIC_BASE_URL`：
```env
# NEXT_PUBLIC_BASE_URL=
```

或者直接删除这一行。

### 步骤 2: 构建和部署
```bash
npm run build
npm start
```

### 步骤 3: 验证生产环境
1. 访问 https://dragx.asia/products/androidplayer/android-player-dxpro-luxury-series-8
2. 使用 Facebook Debugger 测试
3. 在 WhatsApp 中测试

---

## 📝 技术说明

### 修改的文件

1. **`src/app/layout.js`**
   - 添加了 `metadataBase` 配置
   - 支持通过环境变量动态设置 base URL

2. **`src/app/products/[category]/[slug]/layout.js`**
   - 确保图片 URL 是绝对路径
   - 添加完整的 Open Graph 元数据
   - 添加 Twitter Card 支持
   - 支持动态 base URL

### Open Graph 标签说明

```javascript
openGraph: {
  type: 'website',              // 页面类型
  url: pageUrl,                 // 页面完整 URL
  title: pageTitle,             // 分享标题
  description: pageDescription, // 分享描述
  siteName: 'DRAGX Car Accessories', // 网站名称
  locale: 'en_US',              // 语言区域
  images: [{
    url: productImage,          // 图片完整 URL
    width: 1200,                // 图片宽度
    height: 630,                // 图片高度
    alt: '...',                 // 图片描述
    type: 'image/jpeg',         // 图片类型
  }],
}
```

### 为什么手机版 WhatsApp 更严格？

1. **网络环境** - 移动网络可能更慢，超时时间更短
2. **缓存策略** - 移动版缓存更激进
3. **图片格式** - 移动版对某些格式支持不好
4. **URL 验证** - 移动版对 URL 格式要求更严格

---

## 🔗 有用的链接

- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Open Graph Protocol](https://ogp.me/)
- [Next.js Metadata Documentation](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [WhatsApp Link Preview Guide](https://faq.whatsapp.com/general/how-to-preview-links)

---

## ❓ 常见问题

**Q: 为什么桌面版可以但手机版不行？**
A: 移动版 WhatsApp 对 Open Graph 标签的要求更严格，特别是图片 URL 必须是完整的 HTTPS 绝对路径。

**Q: ngrok 免费版够用吗？**
A: 够用，但每次重启 URL 会变化。如果需要固定 URL，可以考虑 ngrok 付费版或使用其他服务如 localtunnel。

**Q: 测试成功后部署会有问题吗？**
A: 不会，只要记得清除 `NEXT_PUBLIC_BASE_URL` 环境变量即可。

**Q: 可以用其他工具代替 ngrok 吗？**
A: 可以，例如：
- localtunnel: `npx localtunnel --port 3005`
- serveo: `ssh -R 80:localhost:3005 serveo.net`
- cloudflared tunnel

---

## 📞 需要帮助？

如果遇到问题，请检查：
1. 控制台是否有错误信息
2. 数据库连接是否正常
3. 图片 URL 是否可以访问
4. 环境变量是否正确设置

