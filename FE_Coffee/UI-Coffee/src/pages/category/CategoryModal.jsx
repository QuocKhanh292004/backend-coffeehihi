import React, { useState, useEffect } from 'react';

const CategoryModal = ({ isOpen, onClose, mode, initialData, onSave, branches, selectedBranch }) => {
    const [formData, setFormData] = useState({
        category_name: '',
        branch_id: '',
        imageFile: null,
        imagePreview: null
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (mode === 'update' && initialData) {
                setFormData({
                    category_name: initialData.category_name || '',
                    branch_id: initialData.branch_id || '',
                    imageFile: null,
                    imagePreview: initialData.category_image || null
                });
            } else {
                // Mode add: utilise la branche sélectionnée
                setFormData({
                    category_name: '',
                    branch_id: selectedBranch || '',
                    imageFile: null,
                    imagePreview: null
                });
            }
            setErrors({});
        }
    }, [isOpen, mode, initialData, selectedBranch]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 500 * 1024) {
                setErrors(prev => ({
                    ...prev,
                    image: 'Ảnh phải có dung lượng dưới 500KB!'
                }));
                return;
            }

            if (!file.type.startsWith('image/')) {
                setErrors(prev => ({
                    ...prev,
                    image: 'Chỉ chấp nhận file ảnh!'
                }));
                return;
            }

            setErrors(prev => ({ ...prev, image: null }));
            setFormData(prev => ({
                ...prev,
                imageFile: file,
                imagePreview: URL.createObjectURL(file)
            }));
        }
    };

    const handleNameChange = (e) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, category_name: value }));

        if (errors.category_name) {
            setErrors(prev => ({ ...prev, category_name: null }));
        }
    };

    const handleBranchChange = (e) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, branch_id: value }));

        if (errors.branch_id) {
            setErrors(prev => ({ ...prev, branch_id: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.category_name.trim()) {
            newErrors.category_name = 'Vui lòng nhập tên danh mục';
        }

        if (mode === 'add' && !formData.branch_id) {
            newErrors.branch_id = 'Vui lòng chọn chi nhánh';
        }

        if (mode === 'add' && !formData.imageFile) {
            newErrors.image = 'Vui lòng chọn ảnh danh mục';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const form = new FormData();
            form.append("category_name", formData.category_name.trim());
            form.append("branch_id", formData.branch_id);

            if (formData.imageFile) {
                form.append("image", formData.imageFile); // 👈 TÊN PHẢI TRÙNG multer
            }

            await onSave(form);

            setFormData({
                category_name: '',
                branch_id: selectedBranch || '',
                imageFile: null,
                imagePreview: null
            });
        } catch (error) {
            console.error('Error saving category:', error);
            setErrors(prev => ({
                ...prev,
                submit: 'Có lỗi xảy ra. Vui lòng thử lại!'
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            setFormData({
                category_name: '',
                branch_id: selectedBranch || '',
                imageFile: null,
                imagePreview: null
            });
            setErrors({});
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-10">
                    <h2 className="text-2xl font-bold text-center text-slate-800 mb-8">
                        {mode === 'add' ? '✨ Thêm danh mục mới' : '✏️ Cập nhật danh mục'}
                    </h2>

                    {/* Chọn Chi Nhánh - CHỈ HIỂN THỊ KHI THÊM MỚI */}
                    {mode === 'add' && (
                        <div className="relative mb-6">
                            <select
                                value={formData.branch_id}
                                onChange={handleBranchChange}
                                className={`w-full px-5 py-4 rounded-xl border-2 transition-all text-slate-700 font-semibold appearance-none bg-white
                                    ${errors.branch_id
                                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                                    : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20'
                                } 
                                    focus:outline-none focus:ring-2`}
                            >
                                <option value="">-- Chọn chi nhánh --</option>
                                {branches?.map(branch => (
                                    <option key={branch.branch_id} value={branch.branch_id}>
                                        {branch.branch_name}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                                🏪
                            </div>
                            {errors.branch_id && (
                                <p className="mt-2 text-xs text-red-500 font-medium flex items-center gap-1">
                                    <span>⚠️</span> {errors.branch_id}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Input Tên Danh Mục */}
                    <div className="relative mb-6">
                        <input
                            type="text"
                            value={formData.category_name}
                            onChange={handleNameChange}
                            placeholder="Nhập tên danh mục..."
                            className={`w-full px-5 py-4 rounded-xl border-2 transition-all pt-7 text-slate-700 font-semibold
                                ${errors.category_name
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                                : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20'
                            } 
                                focus:outline-none focus:ring-2`}
                        />
                        <label className={`absolute left-5 top-2 text-[10px] font-bold uppercase tracking-widest transition-all 
                            ${formData.category_name
                            ? 'opacity-100 text-emerald-600'
                            : 'opacity-0'
                        }`}>
                            Tên danh mục
                        </label>
                        {errors.category_name && (
                            <p className="mt-2 text-xs text-red-500 font-medium flex items-center gap-1">
                                <span>⚠️</span> {errors.category_name}
                            </p>
                        )}
                    </div>

                    {/* Khu vực Ảnh */}
                    <div className="flex flex-col items-center gap-4 mb-6">
                        <div className={`w-32 h-32 bg-slate-50 rounded-2xl border-2 border-dashed transition-all flex items-center justify-center overflow-hidden shadow-inner
                            ${errors.image ? 'border-red-300' : 'border-slate-200'}`}>
                            {formData.imagePreview ? (
                                <img
                                    src={formData.imagePreview}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex flex-col items-center text-slate-300">
                                    <span className="text-4xl text-emerald-400 opacity-60">📷</span>
                                    <span className="text-xs mt-1 text-slate-400">Chưa có ảnh</span>
                                </div>
                            )}
                        </div>

                        <input
                            type="file"
                            id="fileCategory"
                            className="hidden"
                            onChange={handleImageChange}
                            accept="image/jpeg,image/png,image/jpg,image/webp"
                        />
                        <label
                            htmlFor="fileCategory"
                            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold cursor-pointer transition-all shadow-lg shadow-emerald-500/30 active:scale-95 flex items-center gap-2"
                        >
                            <span>📸</span>
                            <span>{formData.imagePreview ? 'Thay đổi ảnh' : 'Chọn ảnh danh mục'}</span>
                        </label>

                        {errors.image ? (
                            <p className="text-red-500 text-xs font-medium flex items-center gap-1">
                                <span>⚠️</span> {errors.image}
                            </p>
                        ) : (
                            <p className="text-slate-400 text-xs font-medium flex items-center gap-1">
                                <span>💡</span> Ảnh phải có dung lượng dưới 500KB
                            </p>
                        )}

                        {formData.imageFile && (
                            <p className="text-xs text-emerald-600 font-medium bg-emerald-50 px-3 py-1 rounded-lg">
                                ✅ {formData.imageFile.name}
                            </p>
                        )}
                    </div>

                    {errors.submit && (
                        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600 font-medium flex items-center gap-2">
                                <span>❌</span> {errors.submit}
                            </p>
                        </div>
                    )}

                    <div className="flex gap-4 mt-8">
                        <button
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="flex-1 py-3.5 border-2 border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex-1 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Đang xử lý...</span>
                                </>
                            ) : (
                                <>
                                    <span>{mode === 'add' ? '➕' : '✏️'}</span>
                                    <span>{mode === 'add' ? 'Thêm mới' : 'Cập nhật'}</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryModal;