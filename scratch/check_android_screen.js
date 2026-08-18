const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkAndroidScreenProducts() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT || 3306,
  });

  const [rows] = await connection.execute(
    "SELECT id, name, categories, filter, filter1, custom_filter, android_series FROM products WHERE categories = 'androidplayer' AND filter1 = 'contiAndroid' LIMIT 30"
  );
  console.log('Total contiAndroid rows found:', rows.length);
  console.log(JSON.stringify(rows, null, 2));

  const [distinctFilters] = await connection.execute(
    "SELECT DISTINCT filter, custom_filter, android_series FROM products WHERE categories = 'androidplayer' AND filter1 = 'contiAndroid'"
  );
  console.log('Distinct filter combinations for contiAndroid:', JSON.stringify(distinctFilters, null, 2));

  await connection.end();
}

checkAndroidScreenProducts().catch(console.error);
