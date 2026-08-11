import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'testing456',
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  connectTimeout: 60000,
  acquireTimeout: 60000,
  timeout: 60000
};

// Add SSL configuration if DB_SSL is enabled
if (process.env.DB_SSL === 'true') {
  dbConfig.ssl = {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: false
  };
}

// 使用全局變量緩存數據庫連接池，避免 Next.js 在開發模式下因熱重載(HMR)頻繁創建新連接
const globalForDb = globalThis;

const pool = globalForDb.mysqlPool || mysql.createPool(dbConfig);

if (process.env.NODE_ENV !== 'production') {
  globalForDb.mysqlPool = pool;
}

export default pool;