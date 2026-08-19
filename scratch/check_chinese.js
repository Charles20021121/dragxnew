const https = require('https');

const login = "htechcodesolution888@gmail.com";
const password = "a0d036fafb5e4b74";
const auth = Buffer.from(`${login}:${password}`).toString('base64');

function postRequest(path, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    const options = {
      hostname: 'api.dataforseo.com',
      port: 443,
      path: path,
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve(parsed);
        } catch (e) {
          resolve(body);
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(postData);
    req.end();
  });
}

async function runChineseCheck() {
  const zhKeywords = [
    "汽车安卓机",
    "安卓机 马来西亚",
    "汽车导航屏幕",
    "android player 推荐",
    "android player 多少钱",
    "汽车改装屏幕",
    "汽车中控大屏",
    "myvi 安卓机",
    "bezza 安卓机",
    "汽车音响店 near me"
  ];

  const volData = [
    {
      "keywords": zhKeywords,
      "location_code": 2458,
      "language_code": "zh"
    }
  ];

  const res = await postRequest('/v3/keywords_data/google_ads/search_volume/live', volData);
  if (res.tasks && res.tasks[0] && res.tasks[0].result) {
    res.tasks[0].result.forEach(r => {
      console.log(`${r.keyword.padEnd(20)} | Vol: ${r.search_volume}`);
    });
  }
}

runChineseCheck().catch(console.error);
