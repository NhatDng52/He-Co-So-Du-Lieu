const customerModel = require('../models/customerModel');
const jwt = require('jsonwebtoken');

// Lấy thông tin người dùng
const getCustomer = async (req, res) => {
    try {
        const customerId = req.user.id; // Lấy ID từ middleware xác thực
        const customer = await customerModel.getCustomerById(customerId);

        if (!customer) {
            return res.status(404).json({ message: 'Người dùng không tồn tại.' });
        }

        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server.', error: error.message });
    }
};

// Lấy voucher của người dùng
const getVouchers = async (req, res) => {
    try {
        const customerId = req.user.id; // Lấy ID người dùng từ middleware
        const vouchers = await customerModel.getVoucherById(customerId);

        if (!vouchers || vouchers.length === 0) {
            return res.status(200).json([]); // Trả về mảng rỗng nếu không có voucher
        }

        res.status(200).json(vouchers);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server.', error: error.message });
    }
};

// Cập nhật thông tin người dùng
const updateCustomer = async (req, res) => {
    try {
        const customerId = req.user.id; // ID người dùng từ middleware
        const { ten, email, cccd, tuoi, gioi_tinh, dia_chi } = req.body; // Các thông tin cần cập nhật

        if (!ten || !email || !cccd || !tuoi || !gioi_tinh || !dia_chi) {
            return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin.' });
        }

        const updated = await customerModel.updateCustomerById(customerId, { ten, email, cccd, tuoi, gioi_tinh, dia_chi });

        if (!updated) {
            return res.status(400).json({ message: 'Cập nhật thông tin thất bại.' });
        }

        res.status(200).json({ message: 'Cập nhật thông tin thành công.' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server.', error: error.message });
    }
};

// Đăng nhập người dùng
const loginCustomer = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Vui lòng cung cấp email và mật khẩu.' });
        }

        const customer = await customerModel.authenticateCustomer(email, password);

        if (!customer) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác.' });
        }

        // Tạo token JWT
        const token = jwt.sign({ id: customer.ma_so_nguoi }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({ message: 'Đăng nhập thành công.', token });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server.', error: error.message });
    }
};

// Đăng ký người dùng
const registerCustomer = async (req, res) => {
    try {
        const { ten, cccd, tuoi, gioi_tinh, dia_chi, email, password } = req.body;

        // Kiểm tra xem tất cả các trường có được cung cấp hay không
        if (!ten || !cccd || !tuoi || !gioi_tinh || !dia_chi || !email || !password) {
            return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin.' });
        }

        // Gọi phương thức đăng ký người dùng từ model
        const registered = await customerModel.registerCustomer({ ten, cccd, tuoi, gioi_tinh, dia_chi, email, password });

        if (!registered) {
            return res.status(400).json({ message: 'Đăng ký thất bại.' });
        }

        res.status(201).json({ message: 'Đăng ký thành công.' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server.', error: error.message });
    }
};


// Đổi mật khẩu
const changePassword = async (req, res) => {
    try {
        const customerId = req.user.id; // ID của người dùng từ middleware xác thực
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin.' });
        }

        const passwordChanged = await customerModel.changePassword(customerId, currentPassword, newPassword);

        if (!passwordChanged) {
            return res.status(400).json({ message: 'Đổi mật khẩu thất bại.' });
        }

        res.status(200).json({ message: 'Đổi mật khẩu thành công.' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server.', error: error.message });
    }
};

module.exports = {
    getCustomer,
    updateCustomer,
    loginCustomer,
    registerCustomer,
    changePassword,
    getVouchers,
};
