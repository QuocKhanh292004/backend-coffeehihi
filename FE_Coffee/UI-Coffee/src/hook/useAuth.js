import { useMutation } from '@tanstack/react-query';
import {
    loginService,
    requestOptService,
    resetPasswordService,
    verifyLoginOtpService,
    verifyOtpService,
    resendLoginOtpService,
} from '../apiServices/authSevices.js';
import { useNavigate } from 'react-router-dom';
import config from '../config/index.js';
import { useAuth } from '../context/AuthContext.jsx';

export const useLogin = () => {
    return useMutation({
        mutationFn: async ({ email, password }) => {
            return await loginService({ email, password });
        },
    });
};

export const useRequestOpt = () => {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: async (email) => {
            return await requestOptService(email);
        },
        onSuccess: (data) => {
            localStorage.setItem('resetMail', data?.data?.email);
            navigate('/verify-otp');
        },
        onError: (error) => {
            console.log('Thất bại', error);
        },
    });
};

export const useVerifyOpt = () => {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: async ({ email, otp }) => {
            return await verifyOtpService(email, otp);
        },
        onSuccess: (data) => {
            localStorage.setItem('resetToken', data?.data?.resetToken);
            localStorage.removeItem('resetMail');
            navigate('/reset-password');
        },
        onError: (error) => {
            console.log('Thất bại', error);
        },
    });
};

export const useResetPassword = () => {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: async ({ resetToken, newPassword }) => {
            return await resetPasswordService(resetToken, newPassword);
        },
        onSuccess: () => {
            navigate('/login');
            localStorage.removeItem('resetToken');
        },
        onError: (error) => {
            console.log('Thất bại', error);
        },
    });
};

export const useVerifyLoginOtp = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    return useMutation({
        mutationFn: async ({ email, otp_code }) => {
            return await verifyLoginOtpService({ email, otp_code });
        },
        onSuccess: (data) => {
            const responseData = data?.data;
            if (responseData) {
                const { token, user } = responseData;
                login({ token, user });
                navigate(config.routes.home, { replace: true });
            }
        },
        onError: (error) => {
            console.log('Thất bại', error);
        },
    });
};

export const useResendLoginOtp = () => {
    return useMutation({
        mutationFn: async ({ email }) => {
            return await resendLoginOtpService({ email });
        },
        onSuccess: () => {
            console.log('OTP resent successfully');
        },
        onError: (error) => {
            console.log('Failed to resend OTP', error);
        },
    });
};
