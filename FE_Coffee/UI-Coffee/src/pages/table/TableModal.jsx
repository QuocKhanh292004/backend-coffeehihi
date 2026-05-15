import React, { useState, useEffect } from 'react';
import { createTable, updateTable } from '../../apiServices/tablesServices.js';

const STATUS_OPTIONS = [
    { value: 'available', label: 'Còn trống' },
    { value: 'occupied', label: 'Đang dùng' },
    { value: 'reserved', label: 'Đã đặt trước' },
];

const TableModal = ({ isOpen, onClose, onSuccess, mode, initialData, branches = [] }) => {
    const [formData, setFormData] = useState({
        // Thêm mới
        table_name: '',
        branch_id: '',
        capacity: '',
        status: 'available',
        // Chỉ dùng khi update
        table_number: '',
    });

    const [showQRView, setShowQRView] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const URL_CUSTOMER = import.meta.env.VITE_BASE_URL_CUSTOMER;

    const isQrMode = mode === 'qr';
    const qrTableId = initialData?.table_id;
    const qrBranchId = initialData?.branch_id;
    const qrValue = qrTableId
        ? `${URL_CUSTOMER}/${qrBranchId}/${qrTableId}`
        : (formData.table_number || formData.table_name || '');

    useEffect(() => {
        if (mode === 'update' && initialData) {
            setFormData({
                table_number: initialData.table_name || '', // map table_name → table_number khi sửa
                capacity: initialData.capacity || '',
                status: initialData.status || 'available',
                // reset các trường add
                table_name: '',
                branch_id: '',
            });
        } else if (mode === 'qr' && initialData) {
            setFormData({
                table_number: initialData.table_name || '',
                capacity: initialData.capacity || '',
                status: initialData.status || 'available',
                table_name: '',
                branch_id: '',
            });
        } else {
            setFormData({
                table_name: '',
                branch_id: '',
                capacity: '',
                status: 'available',
                table_number: '',
            });
        }
        setShowQRView(mode === 'qr');
        setErrors({});
    }, [mode, initialData, isOpen]);

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const newErrors = {};
        if (mode === 'add') {
            if (!formData.table_name.trim()) newErrors.table_name = 'Vui lòng nhập tên bàn';
            if (!formData.branch_id) newErrors.branch_id = 'Vui lòng chọn chi nhánh';
            if (!formData.capacity || Number(formData.capacity) < 1) newErrors.capacity = 'Sức chứa phải lớn hơn 0';
            if (!formData.status) newErrors.status = 'Vui lòng chọn trạng thái';
        } else {
            if (!formData.table_number.trim()) newErrors.table_number = 'Vui lòng nhập tên bàn';
            if (!formData.capacity || Number(formData.capacity) < 1) newErrors.capacity = 'Sức chứa phải lớn hơn 0';
            if (!formData.status) newErrors.status = 'Vui lòng chọn trạng thái';
        }
        return newErrors;
    };

    const handleSubmit = async () => {
        if (isQrMode) return;

        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        try {
            if (mode === 'add') {
                const payload = {
                    table_name: formData.table_name.trim(),
                    branch_id: Number(formData.branch_id),
                    capacity: Number(formData.capacity),
                    status: formData.status,
                };
                console.log('Payload thêm bàn:', payload);
                await createTable(payload);
                onSuccess();
            } else {
                const payload = {
                    table_number: formData.table_number.trim(),
                    capacity: Number(formData.capacity),
                    status: formData.status,
                };
                console.log('Payload cập nhật bàn:', payload);
                await updateTable(initialData.table_id, payload);
                setShowQRView(true);
            }
        } catch (err) {
            alert(mode === 'add' ? 'Thêm bàn thất bại!' : 'Cập nhật bàn thất bại!');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // --- QR View ---
    if (showQRView) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
                <div className="bg-white w-full max-w-[320px] rounded-3xl shadow-2xl p-8 flex flex-col items-center">
                    <p className="text-slate-500 text-sm mb-4 font-medium text-center break-all">
                        {qrValue}
                    </p>
                    <div className="w-48 h-48 mb-8 border border-slate-100 p-2 rounded-xl">
                        <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrValue)}`}
                            alt="Table QR"
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div className="flex gap-4 w-full">
                        <button
                            onClick={() => {
                                setShowQRView(false);
                                if (mode === 'update') {
                                    onSuccess();
                                    return;
                                }
                                onClose();
                            }}
                            className="flex-1 py-2.5 bg-[#2d3a54] text-white rounded-xl font-bold shadow-md hover:bg-slate-800 transition-all"
                        >
                            Đóng
                        </button>
                        <button
                            onClick={() => window.print()}
                            className="flex-1 py-2.5 bg-[#f04b7c] text-white rounded-xl font-bold shadow-md hover:bg-pink-600 transition-all"
                        >
                            In QR
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="pt-8 pb-4 text-center">
                    <h2 className="text-2xl font-bold text-slate-700">
                        {mode === 'add' ? 'Thêm mới bàn' : 'Cập nhật bàn'}
                    </h2>
                </div>

                <div className="px-10 pb-10 space-y-5">

                    {/* Tên bàn — thêm mới dùng table_name, sửa dùng table_number */}
                    <div className="relative">
                        <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-400 z-10">
                            Tên bàn <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            name={mode === 'add' ? 'table_name' : 'table_number'}
                            placeholder="VD: A01"
                            value={mode === 'add' ? formData.table_name : formData.table_number}
                            onChange={handleInputChange}
                            className={`w-full border rounded-xl px-4 py-3 outline-none focus:border-slate-400 text-slate-600 ${
                                (errors.table_name || errors.table_number) ? 'border-red-300' : 'border-slate-200'
                            }`}
                        />
                        {(errors.table_name || errors.table_number) && (
                            <p className="text-red-400 text-xs mt-1 pl-1">
                                {errors.table_name || errors.table_number}
                            </p>
                        )}
                    </div>

                    {/* Chi nhánh — chỉ khi thêm mới */}
                    {mode === 'add' && (
                        <div className="relative">
                            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-400 z-10">
                                Chi nhánh <span className="text-red-400">*</span>
                            </label>
                            <select
                                name="branch_id"
                                value={formData.branch_id}
                                onChange={handleInputChange}
                                className={`w-full border rounded-xl px-4 py-3 outline-none focus:border-slate-400 text-slate-600 bg-white appearance-none ${
                                    errors.branch_id ? 'border-red-300' : 'border-slate-200'
                                }`}
                            >
                                <option value="">Chọn chi nhánh</option>
                                {branches.map((b) => (
                                    <option key={b.branch_id} value={b.branch_id}>
                                        {b.branch_name}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                            {errors.branch_id && (
                                <p className="text-red-400 text-xs mt-1 pl-1">{errors.branch_id}</p>
                            )}
                        </div>
                    )}

                    {/* Sức chứa */}
                    <div className="relative">
                        <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-400 z-10">
                            Sức chứa <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="number"
                            name="capacity"
                            placeholder="VD: 4"
                            min="1"
                            value={formData.capacity}
                            onChange={handleInputChange}
                            className={`w-full border rounded-xl px-4 py-3 outline-none focus:border-slate-400 text-slate-600 ${
                                errors.capacity ? 'border-red-300' : 'border-slate-200'
                            }`}
                        />
                        {errors.capacity && (
                            <p className="text-red-400 text-xs mt-1 pl-1">{errors.capacity}</p>
                        )}
                    </div>

                    {/* Trạng thái */}
                    <div className="relative">
                        <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-400 z-10">
                            Trạng thái <span className="text-red-400">*</span>
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            className={`w-full border rounded-xl px-4 py-3 outline-none focus:border-slate-400 text-slate-600 bg-white appearance-none ${
                                errors.status ? 'border-red-300' : 'border-slate-200'
                            }`}
                        >
                            {STATUS_OPTIONS.map((s) => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                        {errors.status && (
                            <p className="text-red-400 text-xs mt-1 pl-1">{errors.status}</p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-center items-center gap-4 pt-4">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="min-w-[100px] py-2 border border-slate-200 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="min-w-[100px] bg-[#2d3a54] text-white py-2 rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading && (
                                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                            )}
                            {mode === 'add' ? 'Thêm' : 'Cập Nhật'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TableModal;

