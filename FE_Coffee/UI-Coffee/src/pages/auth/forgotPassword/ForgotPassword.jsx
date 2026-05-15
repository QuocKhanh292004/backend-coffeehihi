import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import config from '../../../config';
import { BeforForgotPassword } from '../../../components/commons/BeforForgotPassword.jsx';
import { useRequestOpt } from '../../../hook/useAuth.js';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const {mutate} = useRequestOpt()

    const handleForgotPassword = (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        mutate(email)
        // Giả lập logic gửi email
        if (email.includes('@')) {
            setMessage(`Đã gửi liên kết đặt lại mật khẩu đến địa chỉ: ${email}. Vui lòng kiểm tra email của bạn.`);
        } else {
            setError('Vui lòng nhập một địa chỉ email hợp lệ.');
        }
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
                        <p className="text-gray-500"> Nhập email của bạn để nhận liên kết đặt lại mật khẩu.</p>
                    </div>

                    <form onSubmit={handleForgotPassword} className="space-y-6">
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative"
                                 role="alert">
                                <span className="block sm:inline">{error}</span>
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
                            <label className="block text-sm font-bold text-gray-700 mb-2">Địa chỉ Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="quanly@coffee.com"
                                className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-600 transition-all"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-yellow-700 hover:bg-yellow-800 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-yellow-900/20 hover:-translate-y-0.5 transition-all duration-200"
                        >
                            Gửi Liên Kết Khôi Phục
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
export default ForgotPassword;
