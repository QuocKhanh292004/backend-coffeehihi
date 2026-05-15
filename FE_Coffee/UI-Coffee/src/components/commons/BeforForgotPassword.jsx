import React from 'react';

export const BeforForgotPassword = () => {
    return (
        <div
            className="hidden lg:flex w-1/2 relative flex-col justify-end pb-16 px-12 overflow-hidden bg-stone-100">
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
                style={{ backgroundImage: 'url(\'https://images.unsplash.com/photo-1542372147193-a7aca54189cd?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)' }}
            ></div>
            {/* Lớp phủ tối màu (Gradient) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
            {/* Nội dung slogan cho QUÊN MẬT KHẨU */}
            <div className="relative z-20 text-white mb-8">
                <div className="w-16 h-1 bg-yellow-400 mb-6"></div>
                {/* Line trang trí */}
                <h2 className="text-4xl font-bold mb-4 leading-snug">
                    Luôn có cách <span className="text-yellow-400">quay lại</span>, <br />
                    Đừng lo lắng!
                </h2>
                <p className="text-yellow-100/80 text-lg max-w-md">
                    Chúng tôi sẽ giúp bạn khôi phục quyền truy cập vào hệ thống quản lý quán cafe một cách nhanh
                    chóng.
                </p>
            </div>
        </div>
    );
};