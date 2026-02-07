/**
 * Email Service - Gửi email OTP và các thông báo khác
 */

const nodemailer = require("nodemailer");

// Cấu hình email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail", // gmail, outlook, etc.
    auth: {
      user: process.env.EMAIL_USER, // Email của bạn
      pass: process.env.EMAIL_PASSWORD, // App password hoặc mật khẩu email
    },
  });
};

/**
 * Gửi OTP qua email
 * @param {string} toEmail - Email người nhận
 * @param {string} otp - Mã OTP 6 số
 * @param {string} userName - Tên người dùng
 */
exports.sendOTP = async (toEmail, otp, userName = "Quý khách") => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Coffee Shop" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Mã OTP khôi phục mật khẩu - Coffee Shop",
      text: `
Xin chào ${userName},

Bạn đã yêu cầu khôi phục mật khẩu cho tài khoản của mình.

Mã OTP của bạn là: ${otp}

Lưu ý: Mã OTP này chỉ có hiệu lực trong 5 phút.

Nếu bạn không yêu cầu khôi phục mật khẩu, vui lòng bỏ qua email này.

---
Coffee Shop
© 2026
      `,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Xin chào ${userName},</h2>
          <p>Bạn đã yêu cầu khôi phục mật khẩu cho tài khoản của mình.</p>
          <div style="background-color: #f0f0f0; padding: 15px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; font-size: 14px;">Mã OTP của bạn:</p>
            <h1 style="margin: 10px 0; color: #333; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
          </div>
          <p><strong>Lưu ý:</strong> Mã OTP này chỉ có hiệu lực trong <strong>5 phút</strong>.</p>
          <p style="color: #666; font-size: 12px;">Nếu bạn không yêu cầu khôi phục mật khẩu, vui lòng bỏ qua email này.</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #999; font-size: 11px;">Coffee Shop © 2026</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Không thể gửi email. Vui lòng thử lại sau.");
  }
};

/**
 * Gửi email thông báo đã đổi mật khẩu thành công
 * @param {string} toEmail - Email người nhận
 * @param {string} userName - Tên người dùng
 */
exports.sendPasswordResetSuccess = async (toEmail, userName = "Quý khách") => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Coffee Shop" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Mật khẩu đã được thay đổi - Coffee Shop",
      text: `
Xin chào ${userName},

Mật khẩu của bạn đã được thay đổi thành công vào lúc ${new Date().toLocaleString("vi-VN")}.

Nếu bạn không thực hiện thay đổi này, vui lòng liên hệ với chúng tôi ngay lập tức.

---
Coffee Shop
© 2026
      `,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Xin chào ${userName},</h2>
          <p>Mật khẩu của bạn đã được thay đổi thành công vào lúc <strong>${new Date().toLocaleString("vi-VN")}</strong>.</p>
          <p style="color: #d9534f; padding: 10px; background-color: #f2dede; border-radius: 5px;">
            ⚠️ Nếu bạn không thực hiện thay đổi này, vui lòng liên hệ với chúng tôi ngay lập tức.
          </p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #999; font-size: 11px;">Coffee Shop © 2026</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Password reset success email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending password reset success email:", error);
    // Không throw error vì đây chỉ là email thông báo, không ảnh hưởng logic chính
    return { success: false, error: error.message };
  }
};
