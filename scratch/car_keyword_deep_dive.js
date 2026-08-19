const https = require('https');
const fs = require('fs');

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

async function runCarKeywords() {
  const carKeywords = [
    // Core terms
    "android player",
    "android player for car",
    "android car player",
    "car android player",
    "car player android",
    "car player with android",
    "android player kereta",
    "radio android kereta",
    "screen android kereta",
    "car screen upgrade",
    
    // Purchase & Installation Intent (High Conversion)
    "kedai android player near me",
    "kedai pasang android player",
    "pasang android player",
    "harga android player",
    "harga android player kereta",
    "best android player for car",
    "best android player malaysia",
    "android player murah",
    "android player malaysia",
    "kedai aksesori kereta near me",
    
    // Car Model specific (Very high intent in Malaysia)
    "myvi android player",
    "bezza android player",
    "axia android player",
    "alza android player",
    "saga android player",
    "persona android player",
    "x50 android player",
    "x70 android player",
    "vios android player",
    "city android player",
    "civic android player",
    "hilux android player",
    "yaris android player",
    "alphard android player",
    "vellfire android player",
    "honda city android player",
    "toyota vios android player",
    
    // Features & Spec keywords
    "android player 360 camera",
    "android player with 360 camera",
    "android player carplay",
    "wireless apple carplay",
    "apple carplay android auto",
    "android player 2k screen",
    "android player qled",
    "android player dsp",
    "android player 4g sim",
    "android player 8 core",
    "android player 9 inch",
    "android player 10 inch",
    "android player 13 inch",
    
    // Brand queries
    "dynavin android player",
    "soundstream android player",
    "nakamichi android player",
    "kenwood android player",
    "pioneer android player",
    "dragx android player"
  ];

  const volData = [
    {
      "keywords": carKeywords,
      "location_code": 2458, // Malaysia
      "language_code": "en"
    }
  ];

  console.log("Fetching search volumes for categorized Malaysian automotive keywords...");
  const searchVolRes = await postRequest('/v3/keywords_data/google_ads/search_volume/live', volData);
  
  let results = [];
  if (searchVolRes.tasks && searchVolRes.tasks[0] && searchVolRes.tasks[0].result) {
    results = searchVolRes.tasks[0].result.map(item => ({
      keyword: item.keyword,
      search_volume: item.search_volume || 0,
      competition: item.competition || 'UNKNOWN',
      cpc: item.cpc || 0,
      monthly_searches: item.monthly_searches || []
    }));
  }

  results.sort((a, b) => b.search_volume - a.search_volume);

  fs.writeFileSync('scratch/car_keyword_volumes.json', JSON.stringify(results, null, 2));

  console.log("\n=======================================================");
  console.log("MALAYSIAN CAR ANDROID PLAYER KEYWORDS RANKED BY VOLUME");
  console.log("=======================================================");
  results.forEach(r => {
    console.log(`${r.keyword.padEnd(35)} | Vol: ${String(r.search_volume).padStart(6)}/mo | Comp: ${String(r.competition).padEnd(6)} | CPC: $${r.cpc}`);
  });
}

runCarKeywords().catch(console.error);
