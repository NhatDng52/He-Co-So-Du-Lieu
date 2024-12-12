const sql = require('mssql');

const config = {
  user: 'Khach',
  password: '1234',
  server: 'NHAT',
  database: 'phim_test',
  options: {
    trustServerCertificate: true,
    trustedConnection:true,
    enableArithAbort:true,
  },
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
