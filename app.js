const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const { connectDB } = require('./db');
const phimRoutes = require('./routes/phimRoutes');

const app = express();
const port = 3000;

// Middleware: Sử dụng express built-in middleware để phân tích JSON và URL-encoded body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));

app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

// Cấu hình view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public')); // Chỉ định thư mục chứa các file EJS

// Kết nối cơ sở dữ liệu
connectDB().then(() => {
  console.log('Kết nối cơ sở dữ liệu thành công');
}).catch(error => {
  console.error('Lỗi kết nối cơ sở dữ liệu:', error);
  process.exit(1); // Dừng ứng dụng nếu kết nối cơ sở dữ liệu thất bại
});

// Sử dụng các route phim
app.use('/api', phimRoutes);

// Phục vụ các file tĩnh từ thư mục public (CSS, JS, hình ảnh...)
app.use(express.static(path.join(__dirname, 'public')));

// Khởi động server
app.listen(port, () => {
  console.log(`Ứng dụng chạy tại http://localhost:${port}`);
});
