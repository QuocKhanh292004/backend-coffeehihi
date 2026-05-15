import React, { useState } from 'react';
import { BeforLogin } from '../../../components/commons/BeforLogin.jsx';
import { useLogin, useVerifyLoginOtp, useResendLoginOtp } from '../../../hook/useAuth.js';
import LoginForm from './LoginForm.jsx';
import OtpForm from './OtpForm.jsx';

const LoginContainer = () => {
    const [otpSent, setOtpSent] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loginEmail, setLoginEmail] = useState(localStorage.getItem('loginEmail') || '');
    const { mutate: loginMutate, isPending: loginLoading } = useLogin();
    const { mutate: verifyMutate, isPending: verifyLoading } = useVerifyLoginOtp();
    const { mutate: resendMutate, isPending: resendLoading } = useResendLoginOtp();

    const getOtpEmail = () => loginEmail || localStorage.getItem('loginEmail') || '';

    const handleLogin = ({ email, password }) => {
        setError('');
        setSuccess('');
        loginMutate(
            { email, password },
            {
                onSuccess: () => {
                    setOtpSent(true);
                    setLoginEmail(email);
                    localStorage.setItem('loginEmail', email);
                },
                onError: (err) => {
                    setError(err.response?.data?.message || 'Email hoặc mật khẩu không chính xác');
                },
            },
        );
    };

    const handleVerifyOtp = (otp_code) => {
        setError('');
        setSuccess('');
        const email = getOtpEmail();
        if (!email) {
            setError('Không tìm thấy email đăng nhập. Vui lòng đăng nhập lại.');
            setOtpSent(false);
            return;
        }

        verifyMutate(
            { email, otp_code },
            {
                onError: (err) => {
                    setError(err.response?.data?.message || 'OTP không chính xác');
                },
            },
        );
    };

    const handleResendOtp = () => {
        setError('');
        setSuccess('');
        const email = getOtpEmail();
        if (!email) {
            setError('Không tìm thấy email đăng nhập. Vui lòng đăng nhập lại.');
            setOtpSent(false);
            return;
        }

        resendMutate(
            { email },
            {
                onSuccess: () => {
                    setSuccess('OTP đã được gửi lại thành công');
                },
                onError: (err) => {
                    setError(err.response?.data?.message || 'Gửi lại OTP thất bại');
                },
            },
        );
    };

    return (
        <div className="min-h-screen flex w-full bg-white font-sans">
            {/* LEFT */}
            <BeforLogin />

            {/* RIGHT */}
            <div className="flex w-full lg:w-1/2 justify-center items-center p-8">
                <div className="w-full max-w-md">
                    <p className="text-center text-gray-500 mb-8">Vui lòng nhập đầy đủ thông tin</p>

                    {/* Login Form */}
                    {!otpSent ? (
                        <LoginForm onLoginSuccess={handleLogin} onError={error} isLoading={loginLoading} />
                    ) : (
                        /* OTP Verification Form */
                        <OtpForm
                            onVerifyOtp={handleVerifyOtp}
                            onResendOtp={handleResendOtp}
                            onError={error}
                            isLoading={verifyLoading}
                            isResendLoading={resendLoading}
                            isBackPage={() => setOtpSent(false)}
                        />
                    )}

                    {/* Success Message */}
                    {success && <p className="text-center text-green-500 mt-4">{success}</p>}
                </div>
            </div>
        </div>
    );
};
export default LoginContainer;
