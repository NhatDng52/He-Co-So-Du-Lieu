const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const authMiddleware = require('../middleware/authMiddleware');

// Đăng nhập khách hàng
router.post('/login', customerController.loginCustomer);

// Đăng ký khách hàng
router.post('/register', customerController.registerCustomer);

// Lấy thông tin khách hàng và vouchers nếu có (yêu cầu xác thực)
router.get('/me', authMiddleware, customerController.getCustomer);

// Cập nhật thông tin khách hàng (yêu cầu xác thực)
router.put('/me', authMiddleware, customerController.updateCustomer);

// Đổi mật khẩu khách hàng (yêu cầu xác thực)
router.put('/change-password', authMiddleware, customerController.changePassword);

// Lấy thông tin vouchers.
router.get('/vouchers', authMiddleware, customerController.getVouchers);

module.exports = router;
