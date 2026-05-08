import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import config from '../../../config';

const LoginForm = ({ onLoginSuccess, onError, isLoading }) => {
    const [email, setEmail] = useState('tranquockhanh2920049@gmail.com');
    const [password, setPassword] = useState('Admin@123456');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        onLoginSuccess({ email, password });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
                <label className="block text-sm font-bold mb-2">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border"
                    required
                />
            </div>
            {/* Password */}
            <div>
                <label className="block text-sm font-bold mb-2">Mật khẩu</label>
                <div className="relative">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border pr-12"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-sm text-gray-400"
                    >
                        {showPassword ? 'Ẩn' : 'Hiện'}
                    </button>
                </div>
            </div>

            {/* Ghi nhớ + Quên mật khẩu */}
            <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                        type="checkbox"
                        className="w-4 h-4 rounded text-yellow-600 focus:ring-yellow-600"
                    />
                    <span className="text-sm text-gray-600">Ghi nhớ tôi</span>
                </label>

                <Link
                    to={config.routes.forgotPassword}
                    className="text-sm font-bold text-yellow-700 hover:underline"
                >
                    Quên mật khẩu?
                </Link>
            </div>

            {/* Error */}
            {onError && (
                <p className="text-red-600 text-sm font-semibold">{onError}</p>
            )}

            {/* Submit */}
            <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 rounded-xl font-bold text-white ${
                    isLoading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-yellow-700 hover:bg-yellow-800'
                }`}
            >
                {isLoading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
            </button>

            {/* Register */}
            <div className="text-center">
                <span className="text-sm text-gray-500">Chưa có tài khoản?</span>
                <Link
                    to={config.routes.register}
                    className="ml-1 font-bold text-yellow-700"
                >
                    Đăng ký ngay
                </Link>
            </div>
        </form>
    );
};

export default LoginForm;

