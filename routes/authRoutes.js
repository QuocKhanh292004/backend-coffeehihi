// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const {
  verifyToken,
  isAdmin,
  verifyTokenOptional,
} = require("../middleware/auth");

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Đăng nhập người dùng
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['email', 'password']
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: 'admin@restaurant.com'
 *               password:
 *                 type: string
 *                 format: password
 *                 example: 'Admin@123456'
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                     token:
 *                       type: string
 *                     expiresIn:
 *                       type: string
 *       401:
 *         description: Email hoặc mật khẩu không chính xác
 *       403:
 *         description: Tài khoản đã bị khóa
 */
router.post("/login", authController.login);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Đăng ký người dùng mới (Unified endpoint)
 *     description: |
 *       Endpoint thống nhất để tạo tài khoản:
 *
 *       **Mode 1: Customer Self-Signup (Không cần auth)**
 *       - Email bắt buộc (phải unique)
 *       - Tự động đăng nhập, trả JWT token
 *       - Luôn có role = customer (role_id: 4)
 *
 *       **Mode 2: Admin/Manager Create Staff (Cần auth)**
 *       - Email tùy chọn (có thể để trống)
 *       - Không tự động đăng nhập, không trả JWT
 *       - Có thể chỉ định role (1=admin, 2=manager, 3=staff)
 *       - Default role = staff (role_id: 3) nếu không chỉ định
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['user_name', 'password']
 *             properties:
 *               user_name:
 *                 type: string
 *                 example: 'Nguyễn Văn A'
 *               password:
 *                 type: string
 *                 format: password
 *                 example: 'Password@123'
 *               email:
 *                 type: string
 *                 format: email
 *                 example: 'user@restaurant.com'
 *                 description: 'Bắt buộc cho customer, tùy chọn cho staff'
 *               role_id:
 *                 type: integer
 *                 enum: [1, 2, 3]
 *                 example: 3
 *                 description: 'Chỉ dùng khi admin/manager tạo staff (1=admin, 2=manager, 3=staff)'
 *     responses:
 *       201:
 *         description: Người dùng được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                     token:
 *                       type: string
 *                       description: 'Chỉ có với customer self-signup'
 *                     expiresIn:
 *                       type: string
 *                       description: 'Chỉ có với customer self-signup'
 *       400:
 *         description: Validation error
 *       403:
 *         description: Unauthorized (auth required nhưng user không phải admin/manager)
 *       409:
 *         description: Email đã được sử dụng
 *     examples:
 *       customerSignup:
 *         summary: Customer tự đăng ký
 *         value:
 *           user_name: 'Khách hàng'
 *           email: 'customer@example.com'
 *           password: 'SecurePass@123'
 *       staffCreation:
 *         summary: Admin tạo tài khoản nhân viên
 *         value:
 *           user_name: 'Nhân viên'
 *           password: 'SecurePass@123'
 *           email: 'staff@restaurant.com'
 *           role_id: 3
 */
router.post("/register", verifyTokenOptional, authController.register);

/**
 * @swagger
 * /api/auth/verify:
 *   post:
 *     summary: Xác minh token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['token']
 *             properties:
 *               token:
 *                 type: string
 *                 example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
 *     responses:
 *       200:
 *         description: Token hợp lệ
 *       401:
 *         description: Token không hợp lệ hoặc đã hết hạn
 */
router.post("/verify", authController.verifyTokenEndpoint);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Làm mới token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['refreshToken']
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token đã được làm mới
 *       401:
 *         description: Refresh token không hợp lệ
 */
router.post("/refresh", authController.refreshToken);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Lấy thông tin người dùng hiện tại
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin người dùng
 *       401:
 *         description: Chưa xác thực
 */
router.get("/me", verifyToken, authController.getCurrentUser);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Đăng xuất
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
 */
router.post("/logout", verifyToken, authController.logout);

/**
 * @swagger
 * /api/auth/check-permission:
 *   post:
 *     summary: Kiểm tra quyền người dùng
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['permission']
 *             properties:
 *               permission:
 *                 type: string
 *                 example: 'create_order'
 *     responses:
 *       200:
 *         description: Kết quả kiểm tra quyền
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Lỗi server
 */
router.post("/check-permission", verifyToken, authController.checkPermission);

// ============================================================================
// FORGOT PASSWORD WITH OTP ROUTES
// ============================================================================

/**
 * @swagger
 * /api/auth/forgot-password/request-otp:
 *   post:
 *     summary: Bước 1 - Yêu cầu mã OTP để đặt lại mật khẩu
 *     description: Gửi mã OTP 6 số qua email. OTP có hiệu lực 5 phút.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['email']
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: 'user@example.com'
 *                 description: 'Email đã đăng ký trong hệ thống'
 *     responses:
 *       200:
 *         description: OTP đã được gửi đến email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Mã OTP đã được gửi đến email của bạn'
 *                 data:
 *                   type: object
 *                   properties:
 *                     expiresIn:
 *                       type: string
 *                       example: '5 phút'
 *       400:
 *         description: Email không hợp lệ
 *       503:
 *         description: Không thể gửi email
 */
router.post(
  "/forgot-password/request-otp",
  authController.requestPasswordResetOTP,
);

/**
 * @swagger
 * /api/auth/forgot-password/verify-otp:
 *   post:
 *     summary: Bước 2 - Xác thực mã OTP
 *     description: Nhập mã OTP 6 số đã nhận qua email để xác thực. Trả về resetToken để dùng cho bước đổi mật khẩu.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['email', 'otp']
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: 'user@example.com'
 *                 description: 'Email đã dùng để yêu cầu OTP'
 *               otp:
 *                 type: string
 *                 pattern: '^\d{6}$'
 *                 example: '123456'
 *                 description: 'Mã OTP 6 chữ số đã nhận qua email'
 *     responses:
 *       200:
 *         description: OTP xác thực thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'OTP xác thực thành công'
 *                 data:
 *                   type: object
 *                   properties:
 *                     resetToken:
 *                       type: string
 *                       example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
 *                       description: 'Token để dùng cho bước reset password'
 *                     expiresIn:
 *                       type: string
 *                       example: '15 phút'
 *       400:
 *         description: Email hoặc OTP không hợp lệ
 *       410:
 *         description: OTP đã hết hạn
 */
router.post(
  "/forgot-password/verify-otp",
  authController.verifyPasswordResetOTP,
);

/**
 * @swagger
 * /api/auth/forgot-password/reset-password:
 *   post:
 *     summary: Bước 3 - Đặt lại mật khẩu mới
 *     description: |
 *       Nhập mật khẩu mới sau khi đã xác thực OTP thành công.
 *
 *       Yêu cầu mật khẩu:
 *       - Tối thiểu 8 ký tự
 *       - Có ít nhất 1 chữ hoa
 *       - Có ít nhất 1 chữ thường
 *       - Có ít nhất 1 chữ số
 *       - Có ít nhất 1 ký tự đặc biệt
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['resetToken', 'newPassword']
 *             properties:
 *               resetToken:
 *                 type: string
 *                 example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
 *                 description: 'Token nhận được từ bước verify OTP'
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: 'NewSecure@123'
 *                 description: 'Mật khẩu mới đủ mạnh'
 *     responses:
 *       200:
 *         description: Đổi mật khẩu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Đổi mật khẩu thành công. Bạn có thể đăng nhập với mật khẩu mới.'
 *       400:
 *         description: Token hoặc mật khẩu không hợp lệ
 *       410:
 *         description: Token đã hết hạn hoặc đã được sử dụng
 */
router.post(
  "/forgot-password/reset-password",
  authController.resetPasswordWithOTP,
);

// Các API password management đã bị ẩn - Được quản lý bởi admin

module.exports = router;
