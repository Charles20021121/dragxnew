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

async function runAnalysis() {
  console.log("=== 1. Checking Current vs Realistic Keyword Search Volume in Malaysia ===");
  
  // Compare what the site currently uses vs what real users search
  const comparisonKeywords = [
    // Current / Fancy words
    "car infotainment system",
    "car multimedia player",
    "smart car infotainment system",
    "smart interface with advanced apps",
    "car media system",
    "smart car player",
    
    // Real user search terms in Malaysia
    "android player",
    "android player malaysia",
    "android player kereta",
    "car android player",
    "best android player malaysia",
    "harga android player",
    "android player murah",
    "pasang android player",
    "carplay malaysia",
    "apple carplay android player",
    "wireless carplay android player",
    "android player myvi",
    "android player bezza",
    "android player persona",
    "android player proton",
    "android player perodua",
    "android player 2k",
    "android player 360 camera",
    "car player android",
    "android head unit malaysia",
    "kedai pasang android player"
  ];

  const volData = [
    {
      "keywords": comparisonKeywords,
      "location_code": 2458, // Malaysia
      "language_code": "en"
    }
  ];

  const searchVolRes = await postRequest('/v3/keywords_data/google_ads/search_volume/live', volData);
  
  let volumes = [];
  if (searchVolRes.tasks && searchVolRes.tasks[0] && searchVolRes.tasks[0].result) {
    volumes = searchVolRes.tasks[0].result.map(item => ({
      keyword: item.keyword,
      search_volume: item.search_volume || 0,
      competition: item.competition || 'UNKNOWN',
      cpc: item.cpc || 0,
      monthly_searches: item.monthly_searches ? item.monthly_searches.slice(0, 3) : []
    }));
  }

  // Sort by search volume descending
  volumes.sort((a, b) => b.search_volume - a.search_volume);
  console.log("\n--- Comparison Keywords Search Volumes (Malaysia) ---");
  volumes.forEach(v => {
    console.log(`${v.keyword.padEnd(35)} | Vol: ${String(v.search_volume).padStart(6)} | Comp: ${String(v.competition).padStart(6)} | CPC: $${v.cpc}`);
  });

  console.log("\n=== 2. Generating Keyword Ideas from DataForSEO Google Ads ===");
  const ideasPayload = [
    {
      "keywords": ["android player", "car android player", "android player malaysia"],
      "location_code": 2458,
      "language_code": "en",
      "include_adult_keywords": false
    }
  ];

  const ideasRes = await postRequest('/v3/keywords_data/google_ads/keywords_for_keywords/live', ideasPayload);
  let keywordIdeas = [];
  if (ideasRes.tasks && ideasRes.tasks[0] && ideasRes.tasks[0].result) {
    keywordIdeas = ideasRes.tasks[0].result.map(item => ({
      keyword: item.keyword,
      search_volume: item.search_volume || 0,
      competition: item.competition || 'UNKNOWN',
      cpc: item.cpc || 0
    })).filter(k => k.search_volume > 0);
    keywordIdeas.sort((a, b) => b.search_volume - a.search_volume);
  }

  console.log(`Found ${keywordIdeas.length} keyword ideas.`);
  const top50 = keywordIdeas.slice(0, 50);
  console.log("\n--- Top 50 High-Volume Keyword Ideas in Malaysia ---");
  top50.forEach(v => {
    console.log(`${v.keyword.padEnd(35)} | Vol: ${String(v.search_volume).padStart(6)} | Comp: ${String(v.competition).padStart(6)} | CPC: $${v.cpc}`);
  });

  // Save to JSON for reference
  fs.writeFileSync('scratch/keyword_analysis_results.json', JSON.stringify({
    comparison: volumes,
    ideas: top50
  }, null, 2));

  console.log("\nResults saved to scratch/keyword_analysis_results.json");
}

runAnalysis().catch(console.error);
