const mysql = require('mysql2/promise');
require('dotenv').config();

// AWS RDS MySQL 연결을 위한 Connection Pool 설정
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// posts 테이블 자동 생성 함수
async function initDb() {
  try {
    const createTableSql = `
      CREATE TABLE IF NOT EXISTS posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    await pool.query(createTableSql);
    console.log('✅ AWS RDS MySQL 연결 및 posts 테이블 준비 완료');
  } catch (err) {
    console.error('❌ RDS DB 초기화 에러:', err.message);
  }
}

// DB 연결 및 테이블 생성을 위해 실행
initDb();

module.exports = pool;
