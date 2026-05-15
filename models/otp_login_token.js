/**
 * OTP Login Token Model
 * 
 * Stores OTP tokens sent during the login process (2FA).
 * After successful email+password verification, OTP is generated and sent to user's email.
 * User must verify OTP within 5 minutes to complete login and receive JWT.
 * Each token is unique, has 5-minute expiry, and can only be used once.
 */

module.exports = (sequelize, DataTypes) => {
  const OTPLoginToken = sequelize.define('OTPLoginToken', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    otp_code: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    verified_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    attempt_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    max_attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 5
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'otp_login_tokens',
    timestamps: false,
    underscored: true
  });

  // Association định nghĩa ở models/index.js
  return OTPLoginToken;
};

