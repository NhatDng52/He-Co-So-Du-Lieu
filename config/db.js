const sql = require('mssql');

const config = {
  user: 'Khach',
  password: '1234',
  server: 'NHAT',
  port: 1433, // Ensure this is the correct port
  database: 'phim_test_6_13',
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    trustServerCertificate: true, // Change to false if you have a valid certificate
    enableArithAbort: true
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

// Enable detailed logging
sql.on('error', err => {
  console.error('SQL error', err);
});

module.exports = { sql, connectDB };