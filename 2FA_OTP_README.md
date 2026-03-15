# 2FA Login OTP - Tổng Hợp Triển Khai

## 🎯 Mục Đích
Thêm chức năng **Đăng nhập An Toàn 2 Bước (2FA)** với OTP qua email cho hệ thống Coffee Shop.

**Quy trình:**
```
Step 1: email + password → Xác thực ✓ → Gửi OTP
                                          ↓
Step 2: OTP 6 số ← Email nhận → Xác thực ✓ → Trả JWT Token
```

---

## ✅ Những gì Đã Được Thêm

### 1️⃣ Database Model (models/otp_login_token.js)
```javascript
- id: Primary key
- user_id: User ID (FK to users)
- otp_code: 6-digit OTP (000000-999999)
- expires_at: 5 phút từ lúc tạo
- is_verified: Đánh dấu đã sử dụng
- attempt_count: Số lần sai (max 5)
- created_at: Timestamp
```

### 2️⃣ Service Functions (services/authService.js)
```
✓ loginStep1(email, password)
  - Verify email + password
  - Create OTP
  - Send via email
  
✓ loginStep2(userId, otpCode)
  - Verify OTP
  - Generate JWT
  
✓ resendLoginOTP(userId)
  - Resend OTP (rate limit 30s)
```

### 3️⃣ API Endpoints (routes/authRoutes.js)
```
POST /api/auth/login/step1       [Without Auth]
  Body: { email, password }
  Response: { user_id, user_name, email, otp_expires_in }

POST /api/auth/login/step2       [Without Auth]
  Body: { user_id, otp_code }
  Response: { user, token, expiresIn }

POST /api/auth/login/resend-otp  [Without Auth]
  Body: { user_id }
  Response: { message, otp_expires_in }
```

### 4️⃣ Email Sending (services/emailService.js)
```
✓ sendLoginOTP(toEmail, otp, userName)
  - Beautiful HTML email template
  - Display 6-digit OTP prominently
  - Security warnings
  - Support contact info
```

### 5️⃣ Database Migration (database/migrations/002_add_otp_login_tokens.sql)
```sql
CREATE TABLE otp_login_tokens (
  id, user_id, otp_code, expires_at,
  is_verified, verified_at, attempt_count,
  max_attempts, created_at
)
```

### 6️⃣ Documentation
- `2FA_LOGIN_OTP_GUIDE.md` - Hướng dẫn chi tiết (436 dòng)
- `2FA_IMPLEMENTATION_CHECKLIST.md` - Checklist triển khai
- `README.md` (file này) - Tóm tắt

---

## 🚀 Cách Sử Dụng

### Quick Start

**1. Chạy Migration**
```bash
# Copy SQL vào MySQL Workbench hoặc chạy command:
mysql -u root -p your_database < database/migrations/002_add_otp_login_tokens.sql

# Hoặc: Schema.sql đã được update, run lại init
```

**2. Restart Server**
```bash
npm start
```

**3. Test Endpoints**

**Step 1 - Request OTP:**
```bash
curl -X POST http://localhost:3000/api/auth/login/step1 \
  -H "Content-Type: application/json" \
  -d '{
    "email":"admin@restaurant.com",
    "password":"Admin@123456"
  }'
```

Expected Response:
```json
{
  "success": true,
  "message": "Mã OTP đã được gửi đến email của bạn",
  "data": {
    "user": {
      "user_id": 1,
      "user_name": "Admin",
      "email": "admin@restaurant.com",
      "role_id": 1
    },
    "otp_expires_in": "5 phút"
  }
}
```

**Step 2 - Verify OTP:**
```bash
curl -X POST http://localhost:3000/api/auth/login/otp_code \
  -H "Content-Type: application/json" \
  -d '{
    "user_email": 1,
    "otp_code": "123456"
  }'
```

Expected Response:
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "7d"
  }
}
```

---

## 🔐 Security Features

| Feature | Implementation |
|---------|-----------------|
| **OTP Expiration** | 5 minutes |
| **Max OTP Attempts** | 5 failed tries |
| **Resend Rate Limit** | 30 seconds |
| **Password Attempts** | 5 tries → Account lock |
| **Email Encryption** | bcrypt |
| **Token Signing** | JWT with SECRET |
| **Audit Logging** | Yes (login action) |

---

## 📋 File Changes Summary

| File | Status | Changes |
|------|--------|---------|
| `models/otp_login_token.js` | ✅ NEW | OTP model |
| `models/index.js` | ✅ MODIFIED | Added OTPLoginToken |
| `services/authService.js` | ✅ MODIFIED | +3 functions |
| `services/emailService.js` | ✅ MODIFIED | +sendLoginOTP |
| `controllers/authController.js` | ✅ MODIFIED | +3 endpoints |
| `routes/authRoutes.js` | ✅ MODIFIED | +3 routes |
| `database/schema.sql` | ✅ MODIFIED | Added table |
| `database/migrations/002_*.sql` | ✅ NEW | Migration file |
| `2FA_LOGIN_OTP_GUIDE.md` | ✅ NEW | Full documentation |
| `2FA_IMPLEMENTATION_CHECKLIST.md` | ✅ NEW | Checklist |

---

## ⚠️ Important Notes

### 1. Old Login Still Works
```
POST /api/auth/login  ← Cũ (trực tiếp trả JWT)
POST /api/auth/login/step1  ← Mới (2FA)
POST /api/auth/login/step2  ← Mới (2FA)
```
Cả hai cách vẫn hoạt động, client có thể chọn.

### 2. Email Configuration Required
```env
# .env file must have:
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### 3. JWT Token Required
```env
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d
```

### 4. Database Indexes
Đã add indexes cho performance:
- `idx_otp_login_tokens_user_id`
- `idx_otp_login_tokens_expires_at`

---

## 🧪 Testing Scenarios

### ✅ Success Scenario
1. POST /login/step1 với đúng email + password
2. Email nhận OTP (6 chữ số)
3. POST /login/step2 với user_id + OTP
4. Trả JWT token
5. Sử dụng JWT để call API khác

### ❌ Wrong Password (5 attempts)
1. POST /login/step1 với sai password → Error 401
2. login_attempt++ (max 5)
3. Lần 6: account.lock_up = true
4. Admin unlock hoặc tự unlock bằng forgot password

### ❌ Wrong OTP (5 attempts)
1. POST /login/step1 ✓
2. POST /login/step2 với sai OTP → Error 401
3. OTP.attempt_count++ (max 5)
4. Lần 6: Phải gọi /resend-otp
5. POST /login/resend-otp → New OTP

### ⏰ OTP Expired
1. POST /login/step1 → OTP created at 10:00:00
2. Expires at 10:05:00
3. POST /login/step2 at 10:06:00 → Error 401 "OTP expired"
4. POST /login/resend-otp → New OTP

### 🚫 Resend Too Fast
1. POST /login/step1 at 10:00:00
2. POST /login/resend-otp at 10:00:15 → Error 429
3. POST /login/resend-otp at 10:00:31 → Success ✓

---

## 📚 Documentation Files

1. **2FA_LOGIN_OTP_GUIDE.md** (436 lines)
   - Complete flow diagram
   - API detailed specs
   - Database schema
   - Security features
   - Frontend integration code
   - Troubleshooting

2. **2FA_IMPLEMENTATION_CHECKLIST.md**
   - Step-by-step checklist
   - Database queries
   - Deployment checklist
   - Common issues & solutions

3. **This File (README)**
   - Quick overview
   - Usage examples
   - File changes summary

---

## 🔄 Frontend Integration (React Example)

```javascript
// Step 1
const handleStep1 = async (email, password) => {
  const res = await fetch('/api/auth/login/step1', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  setUserId(data.data.user.user_id);
  setShowOTPForm(true);
};

// Step 2
const handleStep2 = async (otpCode) => {
  const res = await fetch('/api/auth/login/step2', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, otp_code: otpCode })
  });
  const data = await res.json();
  localStorage.setItem('token', data.data.token);
  redirectToDashboard();
};

// Resend
const handleResend = async () => {
  const res = await fetch('/api/auth/login/resend-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId })
  });
  const data = await res.json();
  showMessage('OTP sent again');
};
```

---

## 📊 Database Schema

```sql
CREATE TABLE otp_login_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  otp_code VARCHAR(10) NOT NULL,           -- "123456"
  expires_at DATETIME NOT NULL,            -- NOW + 5 min
  is_verified BOOLEAN DEFAULT FALSE,       -- Used or not
  verified_at DATETIME,                    -- When used
  attempt_count INT DEFAULT 0,             -- Failed tries
  max_attempts INT DEFAULT 5,              -- Max 5
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_otp_login_tokens_user_id 
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  INDEX idx_otp_login_tokens_user_id (user_id),
  INDEX idx_otp_login_tokens_expires_at (expires_at)
);
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| OTP not sent | Check EMAIL_USER, EMAIL_PASSWORD in .env |
| OTP invalid | OTP expires 5 min, max 5 attempts |
| Too many resend attempts | Wait 30 seconds between resends |
| Account locked | Admin unlock or forgot password |
| JWT token error | Check JWT_SECRET matches |

---

## ✨ What's Next

1. ✅ Run database migration
2. ✅ Restart server
3. ✅ Test all 3 endpoints
4. ✅ Integrate with frontend
5. ✅ Train support team on unlock process
6. ✅ Deploy to production
7. ✅ Monitor logs for issues

---

## 📞 Support

For detailed documentation, check:
- `2FA_LOGIN_OTP_GUIDE.md` - Full guide
- `2FA_IMPLEMENTATION_CHECKLIST.md` - Checklist
- Source files:
  - `models/otp_login_token.js`
  - `services/authService.js`
  - `controllers/authController.js`
  - `routes/authRoutes.js`
  - `services/emailService.js`

---

**Implementation Status: ✅ COMPLETE**

All code has been added and ready for deployment. Just run the database migration and restart the server!

