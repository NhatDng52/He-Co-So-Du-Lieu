const sql = require('msql');
require('dotenv').config();
const config = {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT, // Ensure the dialect is specified
  dialectOptions: {
    multipleStatements: true // Enable multiple result sets
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
