const sql = require('mssql');

const config = {
  user: 'bb',
  password: '1234',
  server: 'LAPTOP-4U7G0UT0/SQLEXPRESS',
  database: 'PHIM_PROJECT',
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
