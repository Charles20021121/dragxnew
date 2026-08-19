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

async function run() {
  console.log("Checking DataForSEO account balance & testing keywords...");
  
  // 1. Check user info/balance
  const userRes = await postRequest('/v3/merchant/google/languages', []); // or user info
  console.log("Status check:", JSON.stringify(userRes).slice(0, 200));

  // 2. Query keyword suggestions / search volume for Malaysia (location_code: 2458, Malaysia)
  const kwData = [
    {
      "keywords": [
        "android player",
        "android player kereta",
        "car android player",
        "android player malaysia",
        "car infotainment system",
        "car multimedia player",
        "apple carplay",
        "car head unit",
        "radio android kereta",
        "pasang android player"
      ],
      "location_code": 2458,
      "language_code": "en"
    }
  ];

  const searchVolRes = await postRequest('/v3/keywords_data/google_ads/search_volume/live', kwData);
  console.log("Search Volume Result:", JSON.stringify(searchVolRes, null, 2).slice(0, 1000));
}

run().catch(console.error);
