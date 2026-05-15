import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faAngleLeft,
    faAngleRight,
    faAngleDoubleLeft,
    faAngleDoubleRight
} from '@fortawesome/free-solid-svg-icons';

export default function Pagination({
                                       currentPage,
                                       totalPages,
                                       totalItems,
                                       startItem,
                                       endItem,
                                       itemsPerPage,
                                       onPageChange,
                                       onItemsPerPageChange
                                   }) {
    // Helper function để tạo array số trang hiển thị
    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            // Nếu tổng số trang ít, hiển thị tất cả
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Nếu nhiều trang, hiển thị thông minh
            if (currentPage <= 3) {
                // Đang ở đầu
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                // Đang ở cuối
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                // Đang ở giữa
                pages.push(1);
                pages.push('...');
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="px-6 py-5 bg-slate-50 border-t border-slate-200">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                {/* Bên trái: Selector số dòng hiển thị */}
                <div className="flex items-center gap-3 text-sm">
                    <span className="text-slate-600 font-medium">Hiển thị:</span>
                    <select
                        value={itemsPerPage}
                        onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                        className="bg-white border-2 border-slate-200 rounded-lg px-3 py-2 font-semibold text-slate-700 cursor-pointer hover:border-emerald-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                    >
                        <option value={5}>5 dòng</option>
                        <option value={10}>10 dòng</option>
                        <option value={20}>20 dòng</option>
                        <option value={50}>50 dòng</option>
                        <option value={100}>100 dòng</option>
                    </select>
                </div>

                {/* Bên phải: Pagination controls */}
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Hiển thị thông tin */}
                    <span className="text-sm text-slate-500 font-medium">
                        {startItem}-{endItem} của {totalItems}
                    </span>

                    {/* Buttons điều hướng */}
                    <div className="flex items-center gap-1">
                        {/* First page */}
                        <button
                            onClick={() => onPageChange(1)}
                            disabled={currentPage === 1}
                            className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            title="Trang đầu"
                        >
                            <FontAwesomeIcon icon={faAngleDoubleLeft} />
                        </button>

                        {/* Previous page */}
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            title="Trang trước"
                        >
                            <FontAwesomeIcon icon={faAngleLeft} />
                        </button>

                        {/* Page numbers - Desktop */}
                        <div className="hidden sm:flex gap-1">
                            {pageNumbers.map((page, index) => {
                                if (page === '...') {
                                    return (
                                        <span
                                            key={`ellipsis-${index}`}
                                            className="w-9 h-9 flex items-center justify-center text-slate-400"
                                        >
                                            ...
                                        </span>
                                    );
                                }
                                return (
                                    <button
                                        key={page}
                                        onClick={() => onPageChange(page)}
                                        className={`w-9 h-9 flex items-center justify-center rounded-lg font-bold transition-all ${
                                            currentPage === page
                                                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg scale-110'
                                                : 'text-slate-600 hover:bg-slate-100'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Mobile: Chỉ hiển thị trang hiện tại */}
                        <div className="sm:hidden flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-lg">
                            <span className="text-emerald-700 font-bold text-sm">
                                Trang {currentPage}/{totalPages}
                            </span>
                        </div>

                        {/* Next page */}
                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            title="Trang sau"
                        >
                            <FontAwesomeIcon icon={faAngleRight} />
                        </button>

                        {/* Last page */}
                        <button
                            onClick={() => onPageChange(totalPages)}
                            disabled={currentPage === totalPages}
                            className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            title="Trang cuối"
                        >
                            <FontAwesomeIcon icon={faAngleDoubleRight} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}