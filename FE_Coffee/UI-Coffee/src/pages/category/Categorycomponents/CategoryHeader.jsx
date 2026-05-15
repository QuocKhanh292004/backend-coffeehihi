import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faPlus
} from '@fortawesome/free-solid-svg-icons';

export const CategoryHeader = ({totalItems, loading, onAddClick, disabled}) => (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight mb-2">
                    Quản lý danh mục
                </h2>
                <p className="text-sm text-slate-500 font-semibold">
                    {loading ? 'Đang tải...' : `Hiển thị ${totalItems} danh mục`}
                </p>
            </div>
            <button
                onClick={onAddClick}
                disabled={disabled}
                className="w-full lg:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500
                to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-3 rounded-xl shadow-lg
                 shadow-emerald-500/30 transition-all active:scale-95 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <FontAwesomeIcon icon={faPlus} className="text-sm"/>
                <span>Thêm Mới</span>
            </button>
        </div>
    </div>)