const jwt = require('jsonwebtoken');

// Middleware xác thực token
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', ''); // Lấy token từ header

    if (!token) {
        return res.status(401).json({ message: 'Token không hợp lệ hoặc không tồn tại.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Xác minh token
        req.user = decoded; // Lưu thông tin người dùng vào req.user
        next(); // Tiếp tục xử lý yêu cầu
    } catch (error) {
        res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
    }
};

module.exports = authMiddleware;

