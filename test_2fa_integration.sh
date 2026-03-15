#!/bin/bash
# 2FA + Traditional Login Test Cases
# File này chứa các ví dụ curl để test cả hai phương thức đăng nhập

BASE_URL="http://localhost:3000"

echo "=========================================="
echo "   2FA + Traditional Login Test Cases"
echo "=========================================="
echo ""

# ==========================================
# TEST 1: TRADITIONAL LOGIN (Cũ)
# ==========================================
echo "TEST 1: Traditional Login (Simple, One-Step)"
echo "==========================================  "
echo ""
echo "Endpoint: POST /api/auth/login"
echo "Body:"
echo '{
  "email": "admin@restaurant.com",
  "password": "Admin@123456",
  "use2FA": false
}'
echo ""
echo "Command:"
echo "curl -X POST $BASE_URL/api/auth/login \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{"
echo '    "email": "admin@restaurant.com",'
echo '    "password": "Admin@123456",'
echo '    "use2FA": false'
echo '  }'"
echo ""
echo "Expected Response:"
echo '{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { "user_id": 1, "email": "admin@restaurant.com", "user_name": "Admin", "role_id": 1 },
    "token": "jwt_token_here",
    "expiresIn": "7d"
  }
}'
echo ""
echo "=========================================="
echo ""

# ==========================================
# TEST 2: 2FA LOGIN - STEP 1 (Request OTP)
# ==========================================
echo "TEST 2: 2FA Login - Step 1 (Request OTP)"
echo "=========================================="
echo ""
echo "Endpoint: POST /api/auth/login"
echo "Body:"
echo '{
  "email": "admin@restaurant.com",
  "password": "Admin@123456",
  "use2FA": true
}'
echo ""
echo "Command:"
echo "curl -X POST $BASE_URL/api/auth/login \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{"
echo '    "email": "admin@restaurant.com",'
echo '    "password": "Admin@123456",'
echo '    "use2FA": true'
echo '  }'"
echo ""
echo "Expected Response:"
echo '{
  "success": true,
  "message": "Mã OTP đã được gửi đến email của bạn",
  "data": {
    "user": { "user_id": 1, "user_name": "Admin", "email": "admin@restaurant.com", "role_id": 1 },
    "otp_expires_in": "5 phút"
  }
}'
echo ""
echo "Next: Check email for OTP code"
echo ""
echo "=========================================="
echo ""

# ==========================================
# TEST 3: 2FA LOGIN - STEP 2 (Verify OTP)
# ==========================================
echo "TEST 3: 2FA Login - Step 2 (Verify OTP)"
echo "=========================================="
echo ""
echo "Endpoint: POST /api/auth/login/step2"
echo "Body:"
echo '{
  "user_id": 1,
  "otp_code": "123456"
}'
echo ""
echo "Command:"
echo "curl -X POST $BASE_URL/api/auth/login/step2 \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{"
echo '    "user_id": 1,'
echo '    "otp_code": "123456"'
echo '  }'"
echo ""
echo "Expected Response (if OTP correct):"
echo '{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {
    "user": { ... },
    "token": "jwt_token_here",
    "expiresIn": "7d"
  }
}'
echo ""
echo "Expected Response (if OTP wrong):"
echo '{
  "success": false,
  "message": "OTP không hợp lệ hoặc đã được sử dụng",
  "statusCode": 401
}'
echo ""
echo "=========================================="
echo ""

# ==========================================
# TEST 4: RESEND OTP
# ==========================================
echo "TEST 4: Resend OTP (Rate Limited 30s)"
echo "========================================"
echo ""
echo "Endpoint: POST /api/auth/login/resend-otp"
echo "Body:"
echo '{
  "user_id": 1
}'
echo ""
echo "Command:"
echo "curl -X POST $BASE_URL/api/auth/login/resend-otp \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{"
echo '    "user_id": 1'
echo '  }'"
echo ""
echo "Expected Response (if wait 30s):"
echo '{
  "success": true,
  "message": "Mã OTP mới đã được gửi đến email của bạn",
  "otp_expires_in": "5 phút"
}'
echo ""
echo "Expected Response (if before 30s):"
echo '{
  "success": false,
  "message": "Vui lòng chờ 15 giây trước khi gửi lại OTP",
  "statusCode": 429
}'
echo ""
echo "=========================================="
echo ""

# ==========================================
# TEST 5: SHARED LOGIN ATTEMPTS
# ==========================================
echo "TEST 5: Shared Login Attempts (Account Lock)"
echo "=============================================="
echo ""
echo "Scenario: Traditional login fails 3 times, 2FA Step1 fails 2 times"
echo ""
echo "Step 1: Traditional login with wrong password (3 times)"
echo "  login_attempt becomes 3"
echo ""
echo "Step 2: 2FA Step1 with wrong password (2 times)"
echo "  login_attempt becomes 5 (accumulated)"
echo "  Account locked! (lock_up = true)"
echo ""
echo "Step 3: Try Traditional login again"
echo "  Error: Account is locked"
echo ""
echo "Step 4: Try 2FA Step1 again"
echo "  Error: Account is locked"
echo ""
echo "✅ Login attempts are SHARED between Traditional and 2FA"
echo ""
echo "=========================================="
echo ""

# ==========================================
# DATABASE VERIFICATION
# ==========================================
echo "DATABASE VERIFICATION QUERIES"
echo "============================="
echo ""
echo "1. Check login attempts:"
echo "   SELECT user_id, email, login_attempt, lock_up FROM users WHERE email = 'admin@restaurant.com';"
echo ""
echo "2. Check OTP records:"
echo "   SELECT * FROM otp_login_tokens WHERE user_id = 1 ORDER BY created_at DESC;"
echo ""
echo "3. Check failed attempts for 2FA:"
echo "   SELECT * FROM otp_login_tokens WHERE user_id = 1 AND is_verified = false;"
echo ""
echo "=========================================="
echo ""

# ==========================================
# QUICK START
# ==========================================
echo "QUICK START COMMANDS"
echo "==================="
echo ""
echo "1. Test Traditional Login:"
curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@restaurant.com","password":"Admin@123456","use2FA":false}' | \
  grep -o '"token":"[^"]*' | head -1 | sed 's/"token":"//' || echo "(Run npm start first)"
echo ""
echo ""
echo "2. Test 2FA Login Step 1:"
curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@restaurant.com","password":"Admin@123456","use2FA":true}' || echo "(Run npm start first)"
echo ""
echo ""
echo "3. Use this token in other API calls:"
echo "   curl -X GET $BASE_URL/api/auth/me \\"
echo '     -H "Authorization: Bearer YOUR_JWT_TOKEN"'
echo ""
echo "=========================================="

