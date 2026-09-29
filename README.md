# BÀI THỰC HÀNH: XÁC THỰC JWT TRÊN SPRING BOOT 3 & SPRING SECURITY 6 SỬ DỤNG NIMBUS JOSE + JWT VÀ SQLITE

## 👤 Thông Tin Sinh Viên
- **Họ và tên**: Trần Thanh Luôn
- **Mã số sinh viên (MSSV)**: 24110280
- **Dự án**: Demo Xác thực JWT trên Spring Boot 3 & Spring Security 6

---

## 📌 Giới Thiệu Dự Án
Ứng dụng minh họa hệ thống xác thực người dùng dựa trên **JSON Web Token (JWT)** được cải tiến với 2 điều chỉnh kỹ thuật cốt lõi:
1. **Nimbus JOSE + JWT (`com.nimbusds:nimbus-jose-jwt`)**: Thay thế thư viện `jjwt` truyền thống để mã hóa, ký và xác thực JWT token chuẩn mực, bảo mật.
2. **Cơ sở dữ liệu SQLite**: Thay thế MySQL bằng SQLite JDBC và `hibernate-community-dialects` để chạy cơ sở dữ liệu dạng file nhúng local (`jwt_springboot3.db`), không cần cài đặt hay cấu hình máy chủ DB độc lập.

---

## 🛠️ Công Nghệ Sử Dụng
- **Language**: Java 17+
- **Framework**: Spring Boot 3.2.5, Spring Security 6, Spring Data JPA
- **JWT Library**: Nimbus JOSE + JWT `9.37.3`
- **Database**: SQLite JDBC `3.45.1.0` + Hibernate Community Dialects
- **Frontend**: Thymeleaf, Bootstrap 5, FontAwesome, JavaScript Fetch API (AJAX)
- **Build Tool**: Maven

---

## 📁 Cấu Trúc Thư Mục Dự Án
```text
BTap10/
├── pom.xml
├── README.md
├── .gitignore
├── jwt_springboot3.db (được tự động tạo khi khởi chạy)
└── src/
    └── main/
        ├── java/
        │   └── vn/
        │       └── iotstar/
        │           ├── JwtSpringboot3Application.java
        │           ├── configs/
        │           │   ├── ApplicationConfiguration.java
        │           │   ├── GlobalExceptionHandler.java
        │           │   └── SecurityConfiguration.java
        │           ├── controllers/
        │           │   ├── AuthController.java
        │           │   ├── AuthenticationController.java
        │           │   └── UserController.java
        │           ├── entity/
        │           │   └── User.java
        │           ├── filter/
        │           │   └── JwtAuthenticationFilter.java
        │           ├── models/
        │           │   ├── LoginResponse.java
        │           │   ├── LoginUserModel.java
        │           │   └── RegisterUserModel.java
        │           ├── repository/
        │           │   └── UserRepository.java
        │           └── services/
        │               ├── AuthenticationService.java
        │               ├── JwtService.java
        │               └── UserService.java
        └── resources/
            ├── application.properties
            ├── static/
            │   └── js/
            │       └── mainjs.js
            └── templates/
                ├── login.html
                └── profile.html
```

---

## ⚙️ Cấu Hình Hệ Thống (`application.properties`)
```properties
server.port=8005
spring.application.name=JWT_springboot3

# Cấu hình SQLite Database
spring.datasource.url=jdbc:sqlite:jwt_springboot3.db
spring.datasource.driver-class-name=org.sqlite.JDBC

# JPA & Hibernate Dialect cho SQLite
spring.jpa.database-platform=org.hibernate.community.dialect.SQLiteDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.open-in-view=false

# Cấu hình JWT (Secret key 256 bits HMAC-SHA256 & Expiration 1 giờ)
security.jwt.secret-key=3cfa76ef14937c1c0ea519f8fc057a80fcd04a7420f8e8bcd0a7567c272e007b
security.jwt.expiration-time=3600000
```

---

## 🚀 Hướng Dẫn Chạy Ứng Dụng

### 1. Yêu cầu môi trường
- JDK 17+ (đã kiểm thử thành công trên Java 17 & Java 21)
- Apache Maven 3.8+

### 2. Biên dịch dự án
Mở terminal tại thư mục gốc của dự án và chạy:
```bash
mvn clean package -DskipTests
```

### 3. Khởi chạy ứng dụng
Chạy ứng dụng bằng lệnh Maven:
```bash
mvn spring-boot:run
```
hoặc chạy file `.jar` đã đóng gói:
```bash
java -jar target/JWT_springboot3-0.0.1-SNAPSHOT.jar
```

Ứng dụng sẽ khởi chạy trên cổng **8005**:
- Trang Đăng nhập & Đăng ký: `http://localhost:8005/login`
- Trang Hồ sơ cá nhân: `http://localhost:8005/user/profile`

---

## 📡 Danh Sách API Endpoints

### 🔑 Authentication APIs (`/auth`)
| HTTP Method | Endpoint | Mô tả | Authorization |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/signup` | Đăng ký tài khoản người dùng mới | Public |
| `POST` | `/auth/login` | Đăng nhập và nhận chuỗi JWT Token | Public |

### 👤 User APIs (`/users`)
| HTTP Method | Endpoint | Mô tả | Authorization |
| :--- | :--- | :--- | :--- |
| `GET` | `/users/me` | Lấy thông tin người dùng đang đăng nhập | Bearer Token |
| `GET` | `/users` | Lấy danh sách toàn bộ người dùng | Bearer Token |

### 🌐 Web Views (`/`)
| HTTP Method | Endpoint | Mô tả |
| :--- | :--- | :--- |
| `GET` | `/login` | Giao diện đăng nhập & đăng ký (Thymeleaf) |
| `GET` | `/user/profile` | Giao diện hồ sơ cá nhân (Thymeleaf + AJAX) |

---

## 🛡️ Điểm Nổi Bật Về Kỹ Thuật

1. **Nimbus JOSE + JWT**:
   - `SignedJWT` & `JWTClaimsSet.Builder` cho phép đóng gói token tiêu chuẩn.
   - `MACSigner` & `MACVerifier` mã hóa và kiểm tra chữ ký token bằng thuật toán `HS256`.
2. **Spring Security 6 State-less**:
   - Vô hiệu hóa Session (STATELESS), mọi request được xác thực độc lập thông qua `JwtAuthenticationFilter`.
3. **Cơ sở dữ liệu SQLite**:
   - Tự động tạo file dữ liệu `jwt_springboot3.db` tại thư mục gốc. Không cần cài đặt MySQL Server.
4. **Xử lý ngoại lệ chuẩn RFC 7807**:
   - `GlobalExceptionHandler` trả về đối tượng `ProblemDetail` chuẩn hóa cho các trường hợp 401 Unauthorized, 403 Forbidden và 500 Internal Error.
---

## 🧪 Kịch Bản Kiểm Thử & Kết Quả (Testing & Evidences)

### 1. Kiểm thử API qua Postman
- **Bước 1: Đăng ký tài khoản (`POST /auth/signup`)**
  - **Body (raw JSON):**
    ```json
    {
      "email": "test@iotstar.vn",
      "password": "password123",
      "fullName": "Nguyen Van A"
    }
    ```
  - **Kết quả:** Trả về mã `200 OK` và thông tin User với mật khẩu đã băm bằng BCrypt.
  - *(Chèn ảnh chụp màn hình Postman Signup tại đây)*

- **Bước 2: Đăng nhập (`POST /auth/login`)**
  - **Body (raw JSON):**
    ```json
    {
      "email": "test@iotstar.vn",
      "password": "password123"
    }
    ```
  - **Kết quả:** Trả về `200 OK` chứa chuỗi `token` và `expiresIn: 3600000`.
  - *(Chèn ảnh chụp màn hình Postman Login tại đây)*

- **Bước 3: Truy cập tài nguyên bảo vệ KHÔNG đính kèm Token (`GET /users/me`)**
  - **Kết quả:** Trả về mã `403 Forbidden` (Bộ lọc Spring Security chặn truy cập).
  - *(Chèn ảnh chụp màn hình Postman 403 Forbidden tại đây)*

- **Bước 4: Truy cập tài nguyên bảo vệ CÓ đính kèm Bearer Token (`GET /users/me`)**
  - **Authorization:** `Bearer <token>`
  - **Kết quả:** Trả về `200 OK` kèm thông tin cá nhân của User sở hữu token.
  - *(Chèn ảnh chụp màn hình Postman 200 OK tại đây)*

- **Bước 5: Kiểm tra Token rác / Hết hạn (`GET /users/me`)**
  - **Authorization:** `Bearer abcxyz123...`
  - **Kết quả:** `GlobalExceptionHandler` bắt lỗi và trả về JSON chuẩn `ProblemDetail` (RFC 7807) với mã trạng thái tương ứng.
  - *(Chèn ảnh chụp màn hình Postman Exception tại đây)*

---

### 2. Kiểm thử Giao diện Web (Thymeleaf + AJAX)
- **Luồng hoạt động:**
  1. Mở trình duyệt vào `http://localhost:8005/login`, nhập email và mật khẩu.
  2. Bấm nút **Đăng nhập**: JavaScript gửi AJAX POST lên `/auth/login`, nhận token lưu vào `localStorage.token`, sau đó tự động chuyển hướng sang `/user/profile`.
  3. Tại trang `/user/profile`: AJAX tự lấy token từ `localStorage` gửi lên `/users/me` để render thông tin họ tên, User ID, Email và ngày tạo tài khoản.
  4. Bấm nút **Đăng xuất hệ thống**: `localStorage` được xóa sạch (`localStorage.clear()`) và người dùng được chuyển về lại trang `/login`.
- *(Chèn ảnh chụp màn hình trang Login và trang Profile thực tế của bạn tại đây)*"# BTAP10_LTWeb" 
