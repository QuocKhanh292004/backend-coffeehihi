import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import config from '../../../config';
import { BeforForgotPassword } from '../../../components/commons/BeforForgotPassword.jsx';
import { useVerifyOpt } from '../../../hook/useAuth.js';

const VerifyOTP = () => {
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { mutate, error: errorServer } = useVerifyOpt();
    const email = localStorage.getItem('resetMail');

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        // validate opt
        if (otp.length !== 6) {
            setError('Vui lòng nhập đúng 6 ký tự.');
        }
        mutate({ email: email, otp: otp });
    };
    return (
        <div className="min-h-screen flex w-full bg-white font-sans">
            <BeforForgotPassword />
            {/* --FORM QUÊN MẬT KHẨU */}
            <div className="flex w-full lg:w-1/2 justify-center items-center p-8 bg-white">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">Quên Mật Khẩu?</h1>
                        <p className="text-gray-500"> Nhập mã OTP để đặt lại mật khẩu.</p>
                    </div>

                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                        {/* Error Message */}
                        {(error || errorServer) && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative"
                                 role="alert">
                                <span className="block sm:inline">{errorServer?.response?.data?.message || error}</span>
                            </div>
                        )}
                        {/* Success Message */}
                        {message && (
                            <div
                                className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl relative"
                                role="alert">
                                <span className="block sm:inline">{message}</span>
                            </div>
                        )}
                        {/* Input Email */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Nhập mã OTP</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="123456"
                                className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-600 transition-all"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-yellow-700 hover:bg-yellow-800 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-yellow-900/20 hover:-translate-y-0.5 transition-all duration-200"
                        >
                            Xác nhận mã OPT
                        </button>
                        {/* Quay lại Đăng Nhập */}
                        <div className="text-center pt-2">
                            <Link to={config.routes.login}
                                  className="font-bold text-gray-700 hover:text-yellow-700 hover:underline">
                                ← Quay lại Đăng Nhập
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default VerifyOTP;
