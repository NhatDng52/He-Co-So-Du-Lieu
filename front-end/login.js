document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "http://localhost:5000/api/customers"; // Địa chỉ API của bạn

    // Chuyển đổi giữa giao diện Đăng nhập và Đăng ký
    const loginContainer = document.getElementById("login-container");
    const registerContainer = document.getElementById("register-container");

    document.getElementById("show-register").addEventListener("click", () => {
        loginContainer.style.display = "none";
        registerContainer.style.display = "block";
    });

    document.getElementById("show-login").addEventListener("click", () => {
        registerContainer.style.display = "none";
        loginContainer.style.display = "block";
    });

    // Hàm lưu token vào localStorage
    const setToken = (token) => localStorage.setItem("token", token);

    // Xử lý Đăng nhập
    const loginForm = document.getElementById("login-form");
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setToken(data.token); // Lưu token vào localStorage
                window.location.href = "dashboard.html"; // Chuyển đến trang dashboard
            } else {
                document.getElementById("login-error-message").innerText = data.message;
            }
        } catch (error) {
            document.getElementById("login-error-message").innerText = "Đã xảy ra lỗi, vui lòng thử lại.";
        }
    });

    // Xử lý Đăng ký
    const registerForm = document.getElementById("register-form");
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = document.getElementById("register-name").value;
        const email = document.getElementById("register-email").value;
        const password = document.getElementById("register-password").value;
        const cccd = document.getElementById("register-cccd").value;
        const age = document.getElementById("register-age").value;
        const gender = document.getElementById("register-gender").value;
        const address = document.getElementById("register-address").value;

        try {
            const response = await fetch(`${API_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ten: name,
                    email,
                    password,
                    cccd,
                    tuoi: age,
                    gioi_tinh: gender,
                    dia_chi: address
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Đăng ký thành công! Vui lòng đăng nhập.");
                registerContainer.style.display = "none";
                loginContainer.style.display = "block";
            } else {
                document.getElementById("register-error-message").innerText = data.message;
            }
        } catch (error) {
            document.getElementById("register-error-message").innerText = "Đã xảy ra lỗi, vui lòng thử lại.";
        }
    });
});
