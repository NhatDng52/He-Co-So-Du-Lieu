require('dotenv').config();
const express = require('express');
const app = express();
const customerRoutes = require('./routes/customerRoutes');
const db = require('./config/db');
const cors = require('cors');

// Sử dụng CORS
app.use(
    cors({
        origin: "http://127.0.0.1:5500",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.json());

// Routes
app.use('/api/customers', customerRoutes);

// Kiểm tra kết nối DB
(async () => {
    try {
        const [rows, fields] = await db.execute('SELECT 1'); // Kiểm tra kết nối
        console.log('Kết nối cơ sở dữ liệu thành công:', rows);
    } catch (err) {
        console.error('Lỗi kết nối cơ sở dữ liệu:', err.message);
    }
})();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server đang chạy trên cổng ${PORT}`);
});

