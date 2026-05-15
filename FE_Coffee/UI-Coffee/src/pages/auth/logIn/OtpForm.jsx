import React, { useState } from 'react';

const OtpForm = ({ onVerifyOtp, isBackPage, onResendOtp, onError, isLoading, isResendLoading }) => {
    const [otp_code, setOtp] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (otp_code.length !== 6) {
            onError('Vui lòng nhập đúng 6 ký tự.');
            return;
        }
        onVerifyOtp(otp_code);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP */}
            <div>
                <label className="block text-sm font-bold mb-2">Mã OTP</label>
                <input
                    type="text"
                    value={otp_code}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border"
                    required
                />
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
                {isLoading ? 'Đang xác thực...' : 'Xác thực OTP'}
            </button>

            {/* Resend OTP */}
            <div className="text-center">
                <span className="text-sm text-gray-500">Không nhận được mã?</span>
                <button
                    type="button"
                    onClick={onResendOtp}
                    className="ml-1 font-bold text-yellow-700 cursor-pointer hover:text-gray-400"
                    disabled={isResendLoading}
                >
                    {isResendLoading ? 'Đang gửi lại mã...' : 'Gửi lại mã'}
                </button>
            </div>
            <div className="text-center">
                <button
                    type="button"
                    onClick={isBackPage}
                    className="ml-1 font-bold text-yellow-700 cursor-pointer  hover:text-gray-400"
                >
                    Quay lại login
                </button>
            </div>
        </form>
    );
};

export default OtpForm;
