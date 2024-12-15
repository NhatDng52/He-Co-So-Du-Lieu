const db = require('../config/db');

// Lấy thông tin người dùng theo ID
const getCustomerById = async (id) => {
    const [rows] = await db.execute('SELECT * FROM Nguoi WHERE ma_so_nguoi = ?', [id]);
    return rows[0];
};

// Lấy thông tin voucher theo ID người dùng
const getVoucherById = async (customerId) => {
    const [rows] = await db.execute(
        'SELECT * FROM Voucher WHERE ma_so_nguoi = ? AND han_su_dung >= CURRENT_DATE()'
        , [customerId]);

    // Kiểm tra nếu không có voucher nào, trả về mảng rỗng
    if (!rows || rows.length === 0) {
        return [];
    }

    return rows; // Trả về tất cả voucher hợp lệ
};

// Cập nhật thông tin người dùng
const updateCustomerById = async (id, data) => {
    const { ten, email, cccd, tuoi, gioi_tinh, dia_chi } = data;
    const [result] = await db.execute(
        'UPDATE Nguoi SET ten = ?, email = ?, cccd = ?, tuoi = ?, gioi_tinh = ?, dia_chi = ? WHERE ma_so_nguoi = ?',
        [ten, email, cccd, tuoi, gioi_tinh, dia_chi, id]
    );
    return result.affectedRows > 0;
};

// Xác thực người dùng (đăng nhập)
const authenticateCustomer = async (email, password) => {
    const [rows] = await db.execute(
        'SELECT * FROM Nguoi WHERE email = ?',
        [email]
    );

    if (rows.length === 0) {
        return null; // Nếu không có người dùng nào với email đó
    }

    const user = rows[0];

    // So sánh mật khẩu trong cơ sở dữ liệu và mật khẩu người dùng nhập vào
    if (user.password !== password) {
        return null; // Nếu mật khẩu không đúng
    }

    return user; // Trả về thông tin người dùng nếu mật khẩu đúng
};

// Đăng ký người dùng mới
const registerCustomer = async (data) => {
    const { ten, cccd, tuoi, gioi_tinh, dia_chi, email, password } = data;

    // Kiểm tra xem email đã tồn tại trong cơ sở dữ liệu hay chưa
    const [existingCustomer] = await db.execute(
        'SELECT ma_so_nguoi FROM Nguoi WHERE email = ?',
        [email]
    );
    if (existingCustomer.length > 0) {
        throw new Error('Email đã tồn tại.');
    }

    // Thực hiện chèn người dùng mới vào bảng Nguoi
    const [result] = await db.execute(
        'INSERT INTO Nguoi (ten, cccd, tuoi, gioi_tinh, dia_chi, email, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [ten, cccd, tuoi, gioi_tinh, dia_chi, email, password]
    );

    // Trả về true nếu thao tác thành công
    return result.affectedRows > 0;
};


// Thay đổi mật khẩu của người dùng
const changePassword = async (id, currentPassword, newPassword) => {
    // Lấy thông tin người dùng dựa trên ID
    const [customer] = await db.execute(
        'SELECT password FROM Nguoi WHERE ma_so_nguoi = ?',
        [id]
    );

    if (customer.length === 0) {
        throw new Error('Người dùng không tồn tại.');
    }

    // Kiểm tra mật khẩu hiện tại
    if (customer[0].password !== currentPassword) {
        throw new Error('Mật khẩu hiện tại không đúng.');
    }

    // Cập nhật mật khẩu mới
    const [result] = await db.execute(
        'UPDATE Nguoi SET password = ? WHERE ma_so_nguoi = ?',
        [newPassword, id]
    );
    return result.affectedRows > 0;
};

module.exports = {
    getCustomerById,
    updateCustomerById,
    authenticateCustomer,
    registerCustomer,
    changePassword,
    getVoucherById,
};