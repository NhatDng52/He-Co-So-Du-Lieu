document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "http://localhost:5000/api/customers"; // Địa chỉ API của bạn

    // Lấy token JWT từ localStorage
    const getToken = () => localStorage.getItem("token");

    // Xóa token khỏi localStorage
    const clearToken = () => localStorage.removeItem("token");

    // Hiển thị hoặc ẩn form
    const toggleVisibility = (elementId, visible) => {
        const element = document.getElementById(elementId);
        element.style.display = visible ? "block" : "none";
    };

    // Tải thông tin khách hàng
    const loadCustomerInfo = async () => {
        const token = getToken();

        if (!token) {
            window.location.href = "login.html";
            return;
        }

        try {
            const response = await fetch(`${API_URL}/me`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            const customer = await response.json();

            if (response.ok) {
                document.getElementById("customer-name").innerText = customer.ten || "N/A";
                document.getElementById("customer-email").innerText = customer.email || "N/A";
                document.getElementById("customer-cccd").innerText = customer.cccd || "Chưa cập nhật";
                document.getElementById("customer-age").innerText = customer.tuoi || "N/A";
                document.getElementById("customer-gender").innerText = customer.gioi_tinh || "N/A";
                document.getElementById("customer-address").innerText = customer.dia_chi || "N/A";
            } else {
                alert(customer.message);
            }
        } catch (error) {
            alert("Không thể tải thông tin khách hàng.");
        }
    };

    // Tải danh sách voucher
    const loadVouchers = async () => {
        const token = getToken();
        if (!token) {
            window.location.href = "login.html";
            return;
        }
        try {
            const response = await fetch(`${API_URL}/vouchers`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            const vouchers = await response.json();

            if (response.ok) {
                const vouchersTable = document.getElementById("vouchers-table").querySelector("tbody");
                vouchersTable.innerHTML = ""; // Xóa nội dung cũ

                vouchers.forEach((voucher) => {
                    const row = document.createElement("tr");

                    row.innerHTML = `
                        <td>${voucher.ma_voucher}</td>
                        <td>${voucher.loai}</td>
                        <td>${voucher.han_su_dung || "Không có"}</td>
                        <td><button class="use-voucher-button" data-code="${voucher.discount}">Sử dụng</button></td>
                    `;

                    vouchersTable.appendChild(row);
                });

                // Thêm sự kiện cho nút "Sử dụng"
                document.querySelectorAll(".use-voucher-button").forEach((button) => {
                    button.addEventListener("click", (event) => {
                        const voucherCode = event.target.getAttribute("data-code");
                        useVoucher(voucherCode);
                    });
                });
            } else {
                alert("Không thể tải danh sách voucher.");
            }
        } catch (error) {
            alert("Lỗi khi tải danh sách voucher.");
        }
    };

    // Xử lý "Sử dụng" voucher
    const useVoucher = (voucherCode) => {
        // Điều hướng đến trang movie với mã voucher
        window.location.href = `movie.html?voucher=${voucherCode}`;
    };

    // Xử lý cập nhật thông tin khách hàng
    const updateForm = document.getElementById("update-form");
    if (updateForm) {
        updateForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const token = getToken();
            const ten = document.getElementById("new-name").value;
            const email = document.getElementById("new-email").value;
            const cccd = document.getElementById("new-cccd").value;
            const tuoi = document.getElementById("new-age").value;
            const gioi_tinh = document.getElementById("new-gender").value;
            const dia_chi = document.getElementById("new-address").value;
            try {
                const response = await fetch(`${API_URL}/me`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify({ ten, email, cccd, tuoi, gioi_tinh, dia_chi }),
                });
                console.log(response);
                const data = await response.json();
                console.log(data);

                if (response.ok) {
                    document.getElementById("update-message").innerText = "Cập nhật thành công!";
                    toggleVisibility("update-info-container", false);
                    loadCustomerInfo();
                } else {
                    document.getElementById("update-message").innerText = data.message;
                }
            } catch (error) {
                document.getElementById("update-message").innerText = "Không thể cập nhật thông tin.";
            }
        });
    }

    // Xử lý thay đổi mật khẩu
    const changePasswordForm = document.getElementById("change-password-form");
    if (changePasswordForm) {
        changePasswordForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const token = getToken();
            const currentPassword = document.getElementById("current-password").value;
            const newPassword = document.getElementById("new-password").value;

            try {
                const response = await fetch(`${API_URL}/change-password`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify({ currentPassword, newPassword }),
                });

                const data = await response.json();

                if (response.ok) {
                    document.getElementById("password-message").innerText = "Thay đổi mật khẩu thành công!";
                    toggleVisibility("change-password-container", false);
                } else {
                    document.getElementById("password-message").innerText = data.message;
                }
            } catch (error) {
                document.getElementById("password-message").innerText = "Không thể thay đổi mật khẩu.";
            }
        });
    }

    // Hiển thị form thay đổi thông tin
    document.getElementById("edit-info-button").addEventListener("click", () => {
        toggleVisibility("update-info-container", true);
        toggleVisibility("change-password-container", false);
    });

    // Hiển thị form thay đổi mật khẩu
    document.getElementById("change-password-button").addEventListener("click", () => {
        toggleVisibility("change-password-container", true);
        toggleVisibility("update-info-container", false);
    });

    // Xử lý đăng xuất
    const logoutButton = document.getElementById("logout-button");
    logoutButton.addEventListener("click", () => {
        clearToken();
        window.location.href = "login.html"; // Điều hướng về trang đăng nhập
    });

    // Tải thông tin khách hàng khi trang được mở
    loadCustomerInfo();
    // Tải danh sách voucher khi trang được mở
    loadVouchers();
});
