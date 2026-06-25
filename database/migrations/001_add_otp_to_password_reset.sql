-- ============================================================================
-- MIGRATION: Thêm cột OTP vào bảng password_reset_tokens
-- Date: 2026-02-07
-- Description: Cập nhật bảng để hỗ trợ chức năng quên mật khẩu với OTP
-- ============================================================================

USE restaurant_db;

-- Kiểm tra xem cột otp đã tồn tại chưa
SET @dbname = DATABASE();
SET @tablename = 'password_reset_tokens';
SET @columnname = 'otp';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' VARCHAR(6) NOT NULL AFTER token')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Thay đổi cột token thành nullable (không bắt buộc nữa)
ALTER TABLE password_reset_tokens 
MODIFY COLUMN token VARCHAR(500) NULL;

-- Xóa UNIQUE constraint khỏi token (nếu có)
-- DROP INDEX token ON password_reset_tokens;

-- Thêm index cho cột otp
ALTER TABLE password_reset_tokens 
ADD INDEX idx_reset_tokens_otp (otp);

-- Cập nhật comment cho bảng
ALTER TABLE password_reset_tokens 
COMMENT = 'Password reset OTP tokens (5min expiry)';

-- In thông báo thành công
SELECT 'Migration completed successfully!' AS status;
SELECT 'Table password_reset_tokens updated with OTP support' AS message;
