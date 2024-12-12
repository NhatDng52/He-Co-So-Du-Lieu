const express = require('express');
const bodyParser = require('body-parser');
const TicketRoute = require('./routes/TicketRoute');
const app = express();
const port = 3000;
const { connectDB } = require('./config/db'); // Destructure connectDB from the imported object

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', './views');
// Use Routes
app.use('/tickets', TicketRoute);

app.get('/', (req, res) => {
  res.send('Welcome to the Express MVC Example!');
});

connectDB().then(() => {
  console.log('Kết nối cơ sở dữ liệu thành công');
}).catch(error => {
  console.error('Lỗi kết nối cơ sở dữ liệu:', error);
  process.exit(1); // Dừng ứng dụng nếu kết nối cơ sở dữ liệu thất bại
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});