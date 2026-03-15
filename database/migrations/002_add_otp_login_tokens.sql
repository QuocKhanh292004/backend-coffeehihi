-- Migration: Add OTP Login Token table for 2FA
-- Date: 2026-03-15
-- Description: Add otp_login_tokens table to support two-factor authentication during login

CREATE TABLE IF NOT EXISTS otp_login_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  otp_code VARCHAR(10) NOT NULL,
  expires_at DATETIME NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  verified_at DATETIME,
  attempt_count INT DEFAULT 0,
  max_attempts INT DEFAULT 5,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_otp_login_tokens_user_id FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  INDEX idx_otp_login_tokens_user_id (user_id),
  INDEX idx_otp_login_tokens_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='OTP tokens for 2FA login process';

