import request from '../utils/request.js';

export const requestOptService = async (email) => {
    return await request.post('/auth/forgot-password/request-otp', { email });
};

export const verifyOtpService = async (email, otp) => {
    return await request.post('/auth/forgot-password/verify-otp', { email, otp });
};

export const resetPasswordService = async (resetToken, newPassword) => {
    return await request.post('/auth/forgot-password/reset-password', { resetToken, newPassword });
};

export const loginService = async ({ email, password }) => {
    return await request.post('/auth/login/step1', { email, password });
};

export const verifyLoginOtpService = async ({ email, otp_code }) => {
    return await request.post('/auth/login/verify-otp', { email, otp_code });
};

export const resendLoginOtpService = async ({ email }) => {
    return await request.post('/auth/login/resend-otp', { email });
};
