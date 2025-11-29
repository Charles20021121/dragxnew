import pool from '@/lib/db';

export default async function DebugOGPage() {
  // 测试数据库连接和图片 URL
  let productData = null;
  let error = null;

  try {
    const connection = await pool.getConnection();
    try {
      const query = `
        SELECT Url, Name, categories
        FROM products
        WHERE categories = 'androidplayer'
        AND LOWER(REPLACE(Name, ' ', '-')) = 'android-player-dxpro-luxury-series-8'
      `;
      
      const [rows] = await connection.execute(query);
      if (rows.length > 0) {
        productData = rows[0];
      }
    } finally {
      connection.release();
    }
  } catch (err) {
    error = err.message;
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://dragx.asia';

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">Open Graph Debug 调试页面</h1>
        
        {/* 环境变量检查 */}
        <div className="mb-8 p-4 bg-blue-50 rounded">
          <h2 className="text-xl font-semibold mb-3">📋 环境变量</h2>
          <div className="space-y-2 font-mono text-sm">
            <div>
              <strong>NEXT_PUBLIC_BASE_URL:</strong> 
              <span className="ml-2 text-blue-600">{baseUrl}</span>
            </div>
            <div>
              <strong>当前使用的 Base URL:</strong> 
              <span className="ml-2 text-green-600">{baseUrl}</span>
            </div>
          </div>
        </div>

        {/* 数据库查询结果 */}
        <div className="mb-8 p-4 bg-green-50 rounded">
          <h2 className="text-xl font-semibold mb-3">🗄️ 数据库查询结果</h2>
          {error ? (
            <div className="text-red-600">错误: {error}</div>
          ) : productData ? (
            <div className="space-y-2 font-mono text-sm">
              <div>
                <strong>产品名称:</strong> 
                <span className="ml-2">{productData.Name}</span>
              </div>
              <div>
                <strong>分类:</strong> 
                <span className="ml-2">{productData.categories}</span>
              </div>
              <div>
                <strong>原始图片 URL:</strong> 
                <div className="ml-2 break-all text-blue-600">{productData.Url}</div>
              </div>
              <div>
                <strong>处理后的图片 URL:</strong> 
                <div className="ml-2 break-all text-green-600">
                  {productData.Url.startsWith('http') 
                    ? productData.Url 
                    : `${baseUrl}${productData.Url}`}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-yellow-600">未找到产品数据</div>
          )}
        </div>

        {/* 图片预览 */}
        {productData && (
          <div className="mb-8 p-4 bg-purple-50 rounded">
            <h2 className="text-xl font-semibold mb-3">🖼️ 图片预览</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">如果下面的图片能正常显示，说明 URL 是正确的：</p>
                <img
                  src={productData.Url.startsWith('http')
                    ? productData.Url
                    : `${baseUrl}${productData.Url}`}
                  alt={productData.Name}
                  className="max-w-md border rounded shadow"
                />
                <p className="text-xs text-gray-500 mt-2">
                  如果图片无法显示，说明 URL 有问题
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Open Graph 标签预览 */}
        <div className="mb-8 p-4 bg-yellow-50 rounded">
          <h2 className="text-xl font-semibold mb-3">🏷️ 应该生成的 Open Graph 标签</h2>
          {productData && (
            <pre className="bg-gray-800 text-green-400 p-4 rounded overflow-x-auto text-xs">
{`<meta property="og:type" content="website" />
<meta property="og:url" content="${baseUrl}/products/androidplayer/android-player-dxpro-luxury-series-8" />
<meta property="og:title" content="${productData.Name} - Android Player | DRAGX Car Accessories" />
<meta property="og:description" content="Discover the ${productData.Name} from our Android Player collection" />
<meta property="og:site_name" content="DRAGX Car Accessories" />
<meta property="og:locale" content="en_US" />
<meta property="og:image" content="${productData.Url.startsWith('http') ? productData.Url : `${baseUrl}${productData.Url}`}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="${productData.Name} - Android Player" />
<meta property="og:image:type" content="image/jpeg" />`}
            </pre>
          )}
        </div>

        {/* 测试链接 */}
        <div className="mb-8 p-4 bg-red-50 rounded">
          <h2 className="text-xl font-semibold mb-3">🔗 测试链接</h2>
          <div className="space-y-3">
            <div>
              <strong>产品页面:</strong>
              <a 
                href={`${baseUrl}/products/androidplayer/android-player-dxpro-luxury-series-8`}
                target="_blank"
                className="ml-2 text-blue-600 hover:underline break-all"
              >
                {baseUrl}/products/androidplayer/android-player-dxpro-luxury-series-8
              </a>
            </div>
            <div>
              <strong>Facebook Debugger:</strong>
              <a 
                href={`https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(`${baseUrl}/products/androidplayer/android-player-dxpro-luxury-series-8`)}`}
                target="_blank"
                className="ml-2 text-blue-600 hover:underline"
              >
                点击测试 Open Graph
              </a>
            </div>
          </div>
        </div>

        {/* 检查清单 */}
        <div className="p-4 bg-gray-50 rounded">
          <h2 className="text-xl font-semibold mb-3">✅ 检查清单</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <span className="mr-2">□</span>
              <span>图片能在上面正常显示</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">□</span>
              <span>图片 URL 是完整的 HTTPS 地址</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">□</span>
              <span>Base URL 是你的 ngrok URL</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">□</span>
              <span>已重启 Next.js 开发服务器</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">□</span>
              <span>在 Facebook Debugger 中测试通过</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

