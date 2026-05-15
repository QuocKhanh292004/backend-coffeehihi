import React, { useState, useEffect } from 'react';

const BeverageModal = ({ isOpen, onClose, mode, initialData, onSave, categories, branches }) => {
    const [formData, setFormData] = useState({
        name: '',
        price: 0,
        description: '',
        category: '',
        branch: '',
        isOutOfStock: false,
        previewImage: null,
        imageFile: null       // ✅ Thêm imageFile vào formData luôn
    });

    useEffect(() => {
        if (mode === 'update' && initialData) {
            setFormData({
                name: initialData.name || '',
                price: initialData.price || 0,
                description: initialData.description || '',
                category: initialData.category_id || initialData.category || '',
                branch: initialData.branch_id || initialData.branch || '',
                isOutOfStock: initialData.isOutOfStock || false,
                previewImage: initialData.image || null,
                imageFile: null   // Reset file khi mở edit, chỉ upload nếu user chọn ảnh mới
            });
        } else {
            setFormData({
                name: '',
                price: 0,
                description: '',
                category: '',
                branch: '',
                isOutOfStock: false,
                previewImage: null,
                imageFile: null
            });
        }
    }, [mode, initialData, isOpen]);

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // ✅ Giới hạn 2MB thay vì 500KB cho hợp lý hơn, hoặc giữ 500KB nếu server yêu cầu
        if (file.size > 2 * 1024 * 1024) {
            alert('Ảnh phải có dung lượng dưới 2MB!');
            return;
        }

        // ✅ Chỉ tạo preview URL để hiển thị, KHÔNG dùng base64 để upload
        const previewUrl = URL.createObjectURL(file);

        setFormData(prev => ({
            ...prev,
            imageFile: file,           // ✅ Lưu File object thật để upload multipart
            previewImage: previewUrl   // Chỉ dùng để preview trong UI
        }));
    };

    const handleSubmit = () => {
        if (!formData.name.trim()) {
            alert('Vui lòng nhập tên đồ uống!');
            return;
        }
        if (!formData.price || formData.price <= 0) {
            alert('Vui lòng nhập giá hợp lệ!');
            return;
        }
        if (!formData.category) {
            alert('Vui lòng chọn danh mục!');
            return;
        }
        if (!formData.branch) {
            alert('Vui lòng chọn chi nhánh!');
            return;
        }

        // ✅ formData đã bao gồm imageFile (File object) lẫn previewImage (URL)
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-50 p-4">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">

                {/* Header */}
                <div className="pt-6 pb-2 text-center flex-shrink-0">
                    <h2 className="text-xl font-bold text-slate-700">
                        {mode === 'add' ? 'Thêm đồ uống mới' : 'Chỉnh sửa đồ uống'}
                    </h2>
                </div>

                {/* Body */}
                <div className="px-8 py-4 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">

                    {/* Tên đồ uống */}
                    <div className="relative mt-2">
                        <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-bold text-slate-400 z-10">
                            Tên đồ uống <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-emerald-500 transition-all duration-200 text-sm text-slate-600"
                            placeholder="Nhập tên đồ uống"
                        />
                    </div>

                    {/* Giá tiền */}
                    <div className="relative">
                        <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-bold text-slate-400 z-10">
                            Giá <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="price"
                            value={formData.price}
                            onChange={(e) => {
                                const value = e.target.value
                                    .replace(/\D/g, '')
                                    .slice(0, 9);

                                setFormData(prev => ({
                                    ...prev,
                                    price: value
                                }));
                            }}
                            onBeforeInput={(e) => {
                                if (!/^\d+$/.test(e.data)) {
                                    e.preventDefault();
                                }
                            }}
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-emerald-500 transition-all duration-200 text-sm text-slate-600"
                            placeholder="Nhập giá"
                            min="0"
                        />
                    </div>

                    {/* Mô tả */}
                    <div className="relative">
                        <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-bold text-slate-400 z-10">Mô tả</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows="2"
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-emerald-500 transition-all duration-200 text-sm text-slate-600 resize-none"
                            placeholder="Nhập mô tả đồ uống"
                        />
                    </div>

                    {/* Upload ảnh */}
                    <div className="flex items-center gap-4 py-1">
                        <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-200 flex-shrink-0">
                            {formData.previewImage ? (
                                <img src={formData.previewImage} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-orange-400 transform scale-110">
                                    <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M21 21H3V19L5.1 12H4V10H5.67L6.24 8.1L4.29 7.5L4.81 5.57L6.76 6.17L7.33 4.27L9.26 4.84L8.69 6.74L10.64 7.33L10.07 9.23L8.12 8.66L7.55 10.56H16.45L15.88 8.66L13.93 9.23L13.36 7.33L15.31 6.74L14.74 4.84L16.67 4.27L17.24 6.17L19.19 5.57L19.71 7.5L17.76 8.1L18.33 10H20V12H18.9L21 19V21ZM7.24 12L8.71 19H15.29L16.76 12H7.24Z"/>
                                    </svg>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="bg-slate-800 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-md hover:bg-slate-700 transition-all duration-200 cursor-pointer">
                                Ảnh Đồ Uống
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                            {formData.imageFile && (
                                <span className="text-xs text-slate-400 truncate max-w-[160px]">
                                    {formData.imageFile.name}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Danh mục */}
                    <div className="relative">
                        <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-bold text-slate-400 z-10">
                            Danh mục đồ uống <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-emerald-500 transition-all duration-200 text-sm text-slate-600 bg-white appearance-none cursor-pointer"
                        >
                            <option value="">Chọn danh mục</option>
                            {categories && categories.map(cat => (
                                <option key={`modal-cat-${cat.id}`} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-slate-400">▼</div>
                    </div>

                    {/* Chi nhánh */}
                    <div className="relative">
                        <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-bold text-slate-400 z-10">
                            Chi nhánh <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="branch"
                            value={formData.branch}
                            onChange={handleInputChange}
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-emerald-500 transition-all duration-200 text-sm text-slate-600 bg-white appearance-none cursor-pointer"
                        >
                            <option value="">Chọn chi nhánh</option>
                            {branches && branches.map(branch => (
                                <option key={`modal-branch-${branch.id}`} value={branch.id}>{branch.name}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-slate-400">▼</div>
                    </div>

                    {/* Checkbox hết món */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isOutOfStock"
                                name="isOutOfStock"
                                checked={formData.isOutOfStock}
                                onChange={handleInputChange}
                                className="w-4 h-4 rounded border-slate-300 text-slate-800 focus:ring-2 focus:ring-slate-500 cursor-pointer"
                            />
                            <label htmlFor="isOutOfStock" className="text-xs font-bold text-slate-500 cursor-pointer select-none">Hết món</label>
                        </div>
                        <p className="text-red-500 text-xs italic font-medium">
                            Lưu ý: Ảnh đồ uống có dung lượng dưới 2MB!
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 bg-slate-50 flex justify-end items-center gap-6 flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors duration-200"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="bg-slate-800 text-white px-10 py-2.5 rounded-xl font-bold shadow-lg hover:bg-slate-700 hover:shadow-xl active:scale-95 transition-all duration-200 text-sm"
                    >
                        {mode === 'add' ? 'Thêm' : 'Cập Nhật'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BeverageModal;