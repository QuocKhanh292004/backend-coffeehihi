import React, {useState, useEffect} from 'react';
import * as BranchService from '../../apiServices/branchesServices.js';

const BranchModal = ({isOpen, onClose, mode, initialData ,onRefresh}) => {
    const [formData, setFormData] = useState({name: '', description: ''});

    useEffect(() => {
        if (mode === 'update' && initialData) {
            setFormData({name: initialData.name, description: initialData.description});
        } else {
            setFormData({name: '', description: ''});
        }
    }, [mode, initialData, isOpen]);

    if (!isOpen) return null;
    const handleAddBranch = async () => {
        try {
            const payload = {
                branch_name: formData.name.trim(),
                description: formData.description.trim(),
                rid: `br-${Date.now()}`
            };

            const res = await BranchService.postBranches(payload);
            console.log('Thêm chi nhánh thành công:', res);
            onRefresh();
            onClose();
        } catch (error) {
            console.log('Lỗi khi thêm chi nhánh:', error);
        }
    };

    const handleUpdateBranch = async () => {
        try {
            const payload = {
                branch_name: formData.name.trim(),
                description: formData.description.trim(),
            };

            await BranchService.updateBranch(initialData.id, payload);

            onRefresh();
            onClose();
        } catch (error) {
            console.log('Lỗi khi cập nhật chi nhánh:', error);
        }
    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div
                className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="pt-8 pb-4 text-center">
                    <h2 className="text-2xl font-bold text-slate-700">
                        {mode === 'add' ? 'Thêm chi nhánh mới' : 'Cập nhật chi nhánh'}
                    </h2>
                </div>

                <div className="px-8 pb-8 space-y-6">
                    <div className="relative">
                        <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-400 font-bold z-10">Tên
                            chi nhánh</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-slate-400 text-slate-600"
                        />
                    </div>
                    <div className="relative">
                        <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-400 font-bold z-10">Mô
                            tả</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            rows="3"
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-slate-400 text-slate-600 resize-none"
                        />
                    </div>

                    <div className="flex justify-end gap-6 pt-4 items-center">
                        <button onClick={onClose}
                                className="text-slate-400 font-bold hover:text-slate-600 transition-colors">Hủy
                        </button>
                        <button
                            onClick={mode === 'add' ? handleAddBranch : handleUpdateBranch}
                            className="bg-[#1e293b] text-white px-8 py-2.5 rounded-xl font-bold shadow-lg active:scale-95 transition-all"
                        >
                            {mode === 'add' ? 'Thêm' : 'Cập Nhật'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default BranchModal;