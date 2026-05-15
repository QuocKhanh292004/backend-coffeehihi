import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import config from '../../../config';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const handleRegister = (e) => { // Đổi tên hàm xử lý
        e.preventDefault();
        // Simple validation
        if (password !== confirmPassword) {
            setError('Mật khẩu và Xác nhận Mật khẩu không khớp.');
            return;
        }
        setError('');
        console.log({ name, email, password });
        // Logic gọi API đăng ký sẽ được thêm ở đây
        alert('Đăng ký thành công (Dữ liệu đã được log ra console!)');
    };
    return (<div className="min-h-screen flex w-full bg-white font-sans">
        {/* --------------------------
        PHẦN 1: HÌNH ẢNH & Slogan (BÊN TRÁI)
        --------------------------
      */}
        <div
            className="hidden lg:flex w-1/2 relative flex-col justify-end pb-16 px-12 overflow-hidden bg-stone-100">
            {/* Ảnh nền: Barista làm việc trong ánh sáng tự nhiên */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
                style={{ backgroundImage: 'url(\'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=2678&auto=format&fit=crop\')' }}
            ></div>
            {/* Lớp phủ tối màu (Gradient) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>

            {/* Nội dung slogan cho ĐĂNG KÝ */}
            <div className="relative z-20 text-white mb-8">
                <div className="w-16 h-1 bg-yellow-400 mb-6"></div>
                {/* Line trang trí */}
                <h2 className="text-4xl font-bold mb-4 leading-snug">
                    Khởi tạo <span className="text-yellow-400">hiệu suất</span> <br />
                    từ hôm nay!
                </h2>
                <p className="text-yellow-100/80 text-lg max-w-md">
                    Đăng ký để bắt đầu hành trình quản lý quán cà phê của bạn một cách dễ dàng và hiệu quả nhất.
                </p>
            </div>
        </div>
        {/*
        PHẦN 2: FORM ĐĂNG KÝ (BÊN PHẢI)
      */}
        <div className="flex w-full lg:w-1/2 justify-center items-center p-8 bg-white">
            <div className="w-full max-w-md">

                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Tạo Tài Khoản Mới</h1>
                    <p className="text-gray-500"> Vui lòng nhập đầy đủ thông tin!</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-5">

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative"
                             role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>)}

                    {/* Input Tên Quán/Người Dùng */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Tên Bạn</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ví dụ: Coffee A"
                            className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-600 transition-all"
                            required
                        />
                    </div>
                    {/* Input Email */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="quanly@coffee.com"
                            className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-600 transition-all"
                            required
                        />
                    </div>

                    {/* Input Mật khẩu */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Mật khẩu</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-600 transition-all pr-12"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3.5 text-gray-400 hover:text-yellow-700 font-semibold text-sm transition-colors"
                            >
                                {showPassword ? 'Ẩn' : 'Hiện'}
                            </button>
                        </div>
                    </div>

                    {/* Input Xác nhận Mật khẩu */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Xác nhận Mật khẩu</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Nhập lại mật khẩu"
                            className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-600 transition-all"
                            required
                        />
                    </div>
                    {/* Nút Submit Đăng Ký */}
                    <button
                        type="submit"
                        className="w-full bg-yellow-700 hover:bg-yellow-800 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-yellow-900/20 hover:-translate-y-0.5 transition-all duration-200 mt-6"
                    >
                        Đăng Ký
                    </button>
                    {/* Quay lại Đăng Nhập */}
                    <div className="text-center pt-2">
                        <span className="text-gray-500 text-sm ">Đã có tài khoản? </span>
                        <Link to={config.routes.login} className="font-bold text-yellow-700 hover:underline ml-1">
                            Đăng nhập ngay
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    </div>);
};
export default Register;