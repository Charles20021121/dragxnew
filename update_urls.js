const fs = require('fs');
let c = fs.readFileSync('src/app/ambientlight/page.js', 'utf8');
c = c.replace(/\/ambientlight\/Phone\//g, '/ambientlight/phone/'); 
c = c.replace(/'\/ambientlight\//g, "'https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/ambientlight/");
c = c.replace(/"\/ambientlight\//g, "\"https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/ambientlight/");
c = c.replace(/`\/ambientlight\//g, "`https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/ambientlight/");
fs.writeFileSync('src/app/ambientlight/page.js', c);
