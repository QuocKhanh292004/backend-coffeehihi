import React from 'react';

export const BeforLogin = () => {
    return (
        <div className="hidden lg:flex w-1/2 relative flex-col justify-end pb-16 px-12 bg-stone-100">
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage:
                        "url(https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?q=80&w=735&auto=format&fit=crop)",
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="relative z-10 text-white">
                <div className="w-16 h-1 bg-yellow-400 mb-6" />
                <h2 className="text-4xl font-bold mb-4">
                    Quản lý Cafe tinh gọn, <br />
                    <span className="text-yellow-400">hiệu suất tối đa.</span>
                </h2>
                <p className="text-yellow-100/80">
                    Tập trung vào chất lượng đồ uống và dịch vụ khách hàng.
                </p>
            </div>
        </div>
    )
}