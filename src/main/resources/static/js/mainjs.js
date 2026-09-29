document.addEventListener("DOMContentLoaded", function () {
    // Handle Login Page Logic
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;
            const alertBox = document.getElementById("alertMessage");

            alertBox.classList.add("d-none");
            alertBox.innerText = "";

            fetch("/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: email, password: password })
            })
            .then(async (response) => {
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || errorData.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!");
                }
                return response.json();
            })
            .then((data) => {
                if (data.token) {
                    localStorage.setItem("token", data.token);
                    window.location.href = "/user/profile";
                } else {
                    throw new Error("Không nhận được token xác thực!");
                }
            })
            .catch((error) => {
                alertBox.innerText = error.message;
                alertBox.classList.remove("d-none");
            });
        });
    }

    // Handle Register Form Logic (Modal / Tab)
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const fullName = document.getElementById("regFullName").value.trim();
            const email = document.getElementById("regEmail").value.trim();
            const password = document.getElementById("regPassword").value;
            const regAlertBox = document.getElementById("regAlertMessage");

            regAlertBox.classList.add("d-none");
            regAlertBox.innerText = "";

            fetch("/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ fullName: fullName, email: email, password: password })
            })
            .then(async (response) => {
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || errorData.message || "Đăng ký thất bại!");
                }
                return response.json();
            })
            .then((data) => {
                regAlertBox.className = "alert alert-success mt-3";
                regAlertBox.innerText = "Đăng ký tài khoản thành công! Vui lòng chuyển sang tab Đăng nhập.";
                regAlertBox.classList.remove("d-none");
                registerForm.reset();
            })
            .catch((error) => {
                regAlertBox.className = "alert alert-danger mt-3";
                regAlertBox.innerText = error.message;
                regAlertBox.classList.remove("d-none");
            });
        });
    }

    // Handle Profile Page Logic
    const profileContainer = document.getElementById("profileContainer");
    if (profileContainer) {
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "/login";
            return;
        }

        fetch("/users/me", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            }
        })
        .then(async (response) => {
            if (!response.ok) {
                localStorage.clear();
                window.location.href = "/login";
                throw new Error("Phiên làm việc hết hạn hoặc không hợp lệ!");
            }
            return response.json();
        })
        .then((user) => {
            document.getElementById("userFullName").innerText = user.fullName || "N/A";
            document.getElementById("userEmail").innerText = user.email || "N/A";
            document.getElementById("userId").innerText = "#" + (user.id || "");
            
            const createdAtDate = user.createdAt ? new Date(user.createdAt).toLocaleString("vi-VN") : "N/A";
            document.getElementById("userCreatedAt").innerText = createdAtDate;

            const avatarImg = document.getElementById("userAvatar");
            if (user.images && user.images.trim() !== "") {
                avatarImg.src = user.images;
            } else {
                avatarImg.src = "https://api.dicebear.com/7.x/avataaars/svg?seed=" + encodeURIComponent(user.email);
            }

            profileContainer.classList.remove("d-none");
        })
        .catch((error) => {
            console.error("Error loading profile:", error);
            localStorage.clear();
            window.location.href = "/login";
        });
    }

    // Logout Functionality
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function (e) {
            e.preventDefault();
            localStorage.clear();
            window.location.href = "/login";
        });
    }
});
