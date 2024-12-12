const sql = require('mssql');

const config = {
  user: 'sa',
  password: 'kknhatminh24',
  server: 'NHAT',
  database: 'phim_test',
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    trustServerCertificate: true
  }
};

const connectDB = async () => {
  try {
    await sql.connect(config);
    console.log('Kết nối cơ sở dữ liệu thành công');
  } catch (error) {
    console.error('Lỗi kết nối cơ sở dữ liệu:', error);
  }
};

module.exports = { sql, connectDB };
