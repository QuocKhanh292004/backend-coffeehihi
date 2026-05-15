import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEdit, faTrashAlt, faSearch, faPlus, faAngleLeft, faAngleRight,
    faAngleDoubleLeft, faAngleDoubleRight, faStore
} from '@fortawesome/free-solid-svg-icons';
import usePagination from '../../hook/usePagination.js';
import CategoryModal from "./CategoryModal.jsx";
import request from '../../utils/request.js';

const CategoryManagement = () => {
    // States groupés par fonctionnalité
    const [data, setData] = useState({
        categories: [],
        branches: [],
        selectedBranch: '',
        searchTerm: ''
    });

    const [loading, setLoading] = useState({
        branches: false,
        categories: false
    });

    const [modal, setModal] = useState({
        isOpen: false,
        mode: 'add',
        selectedCategory: null
    });

    const [itemsPerPage, setItemsPerPage] = useState(5);

    // Filtrage et pagination
    const filteredCategories = data.categories.filter(cat =>
        cat.category_name?.toLowerCase().includes(data.searchTerm.toLowerCase())
    );

    const { currentPage, totalPages, totalItems, startItem, endItem, currentData, goToPage } =
        usePagination(filteredCategories, itemsPerPage);

    // API Calls
    const api = {
        getBranches: async () => {
            setLoading(prev => ({ ...prev, branches: true }));
            try {
                const response = await request.get('branches');
                // Xử lý cả trường hợp response có data wrapper hoặc không
                const branches = response.data?.data || response.data || [];
                return branches;
            } catch (error) {
                console.error('Error getBranches:', error);
                return [];
            } finally {
                setLoading(prev => ({ ...prev, branches: false }));
            }
        },

        getCategories: async (branchId) => {
            if (!branchId) {
                setData(prev => ({ ...prev, categories: [] }));
                return;
            }
            setLoading(prev => ({ ...prev, categories: true }));
            try {
                const response = await request.get(`/menu/categories?branch_id=${branchId}`);
                console.log('Full Response:', response);

                const categories = response.data?.data || response.data || [];
                console.log('Extracted Categories:', categories);

                setData(prev => ({ ...prev, categories }));
            } catch (error) {
                console.error(' lỗiiiiiii:', error);
                setData(prev => ({ ...prev, categories: [] }));
            } finally {
                setLoading(prev => ({ ...prev, categories: false }));
            }
        },

        saveCategory: async (categoryData) => {
            const endpoint = modal.mode === 'add'
                ? '/menu/categories'
                : `/menu/categories/${modal.selectedCategory.category_id}`;

            const method = modal.mode === 'add' ? 'post' : 'put';

            await request[method](endpoint, {
                name: categoryData.name,
                image: categoryData.imageFile,
                ...(modal.mode === 'add' && { branch_id: data.selectedBranch })
            });
        },

        deleteCategory: async (id) => {
            await request.delete(`/menu/categories/${id}`);
        }
    };

    // Handlers
    const handlers = {
        openAdd: () => {
            if (!data.selectedBranch) {
                alert('Vui lòng chọn chi nhánh!');
                return;
            }
            setModal({ isOpen: true, mode: 'add', selectedCategory: null });
        },

        openEdit: (category) => {
            console.log('Opening edit for category:', category);
            setModal({ isOpen: true, mode: 'update', selectedCategory: category });
        },

        save: async (categoryData) => {
            try {
                await api.saveCategory(categoryData);
                await api.getCategories(data.selectedBranch);
                setModal({ isOpen: false, mode: 'add', selectedCategory: null });
            } catch (error) {
                console.error('Error save:', error);
                alert('Lỗi khi lưu danh mục');
            }
        },

        delete: async (id) => {
            if (!window.confirm('Xóa danh mục này?')) return;
            try {
                await api.deleteCategory(id);
                await api.getCategories(data.selectedBranch);
            } catch (error) {
                console.error('Error delete:', error);
                alert('Lỗi khi xóa danh mục');
            }
        },

        changeBranch: (branchId) => {
            const numericBranchId = Number(branchId);
            console.log('Changing branch to:', numericBranchId);
            setData(prev => ({ ...prev, selectedBranch: numericBranchId }));
        },

        search: (term) => {
            console.log('Searching for:', term);
            setData(prev => ({ ...prev, searchTerm: term }));
        }
    };

    // Initialize - Load branches
    useEffect(() => {
        (async () => {
            const branches = await api.getBranches();
            console.log('Loaded branches:', branches);
            setData(prev => ({
                ...prev,
                branches,
                selectedBranch: branches[0]?.branch_id || ''
            }));
        })();
    }, []);

    // Load categories when branch changes
    useEffect(() => {
        if (data.selectedBranch) {
            console.log('Loading categories for branch:', data.selectedBranch);
            api.getCategories(data.selectedBranch);
        }
    }, [data.selectedBranch]);

    // Debug filtered categories
    useEffect(() => {
        console.log('Filtered categories:', filteredCategories);
        console.log('Current page data:', currentData);
    }, [filteredCategories, currentData]);

    // Render helpers
    const EmptyState = ({ icon, title, subtitle }) => (
        <div className="flex flex-col items-center justify-center py-20">
            {typeof icon === 'string' ? (
                <div className="text-6xl mb-4">{icon}</div>
            ) : (
                <FontAwesomeIcon icon={icon} className="text-6xl text-slate-300 mb-4" />
            )}
            <p className="text-slate-600 font-bold text-lg mb-2">{title}</p>
            {subtitle && <p className="text-slate-400 text-sm">{subtitle}</p>}
        </div>
    );

    const PaginationButton = ({ onClick, disabled, icon, children }) => (
        <button
            onClick={onClick}
            disabled={disabled}
            className={children
                ? `w-9 h-9 flex items-center justify-center rounded-lg font-bold transition-all ${
                    currentPage === children
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                        : 'text-slate-500 hover:bg-slate-100 hidden sm:flex'
                }`
                : 'p-2 disabled:opacity-30 hover:text-emerald-600 text-slate-600 transition-colors'
            }
        >
            {icon ? <FontAwesomeIcon icon={icon} /> : children}
        </button>
    );

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 bg-gradient-to-br from-slate-50 to-white min-h-screen">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight mb-2">
                            Quản lý danh mục
                        </h2>
                        <p className="text-sm text-slate-500 font-semibold">
                            {loading.categories ? 'Đang tải...' : `Hiển thị ${totalItems} danh mục`}
                        </p>
                    </div>
                    <button
                        onClick={handlers.openAdd}
                        disabled={!data.selectedBranch}
                        className="w-full lg:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-3 rounded-xl shadow-lg shadow-emerald-500/30 transition-all active:scale-95 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FontAwesomeIcon icon={faPlus} className="text-sm" />
                        <span>Thêm Mới</span>
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Branch Selector */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-2">
                            <FontAwesomeIcon icon={faStore} className="text-emerald-500" />
                            Chi nhánh
                        </label>
                        <select
                            value={data.selectedBranch}
                            onChange={(e) => handlers.changeBranch(e.target.value)}
                            disabled={loading.branches}
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-semibold disabled:opacity-50"
                        >
                            <option value="">{loading.branches ? 'Đang tải...' : 'Chọn chi nhánh'}</option>
                            {data.branches.map((branch) => (
                                <option key={branch.branch_id} value={branch.branch_id}>
                                    Chi nhánh {branch.branch_id} : {branch.branch_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Search */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-2">
                            <FontAwesomeIcon icon={faSearch} className="text-emerald-500" />
                            Tìm kiếm
                        </label>
                        <div className="relative">
                            <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm tên danh mục..."
                                value={data.searchTerm}
                                onChange={(e) => handlers.search(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-semibold"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
                {loading.categories ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="text-slate-600 font-bold">Đang tải danh mục...</p>
                    </div>
                ) : !data.selectedBranch ? (
                    <EmptyState icon={faStore} title="Vui lòng chọn chi nhánh" />
                ) : currentData.length === 0 ? (
                    <EmptyState
                        icon="📦"
                        title="Không tìm thấy danh mục"
                        subtitle={data.searchTerm ? `Không có kết quả cho "${data.searchTerm}"` : 'Chưa có danh mục nào'}
                    />
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse min-w-[600px]">
                                <thead>
                                <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-widest font-bold">
                                    <th className="py-5 px-6 text-center w-32">Hình ảnh</th>
                                    <th className="py-5 px-6 text-left border-x border-slate-200">Tên Danh mục</th>
                                    <th className="py-5 px-6 text-center w-40">Thao tác</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                {currentData.map((cat) => (
                                    <tr key={cat.category_id} className="hover:bg-emerald-50/50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex justify-center">
                                                <img
                                                    src={cat.category_image || 'https://via.placeholder.com/50'}
                                                    alt={cat.category_name}
                                                    className="w-14 h-14 rounded-xl object-cover ring-2 ring-slate-200 shadow-sm"
                                                />
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 border-x border-slate-100">
                                            <span className="text-slate-700 font-bold text-base">{cat.category_name}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex justify-center gap-3">
                                                <button
                                                    onClick={() => handlers.openEdit(cat)}
                                                    className="w-10 h-10 flex items-center justify-center text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all active:scale-90"
                                                    title="Chỉnh sửa"
                                                >
                                                    <FontAwesomeIcon icon={faEdit} />
                                                </button>
                                                <button
                                                    onClick={() => handlers.delete(cat.category_id)}
                                                    className="w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg transition-all active:scale-90"
                                                    title="Xóa"
                                                >
                                                    <FontAwesomeIcon icon={faTrashAlt} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="px-6 py-5 bg-slate-50 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                                <span>Số dòng:</span>
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                    className="bg-white border border-slate-200 rounded-lg px-3 py-2 font-bold text-slate-700 cursor-pointer hover:border-emerald-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                >
                                    {[5, 10, 20].map(n => <option key={n} value={n}>{n}</option>)}
                                </select>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-6 text-xs font-bold uppercase tracking-wider">
                                <span className="text-slate-400">{startItem}-{endItem} của {totalItems}</span>
                                <div className="flex items-center gap-1">
                                    <PaginationButton onClick={() => goToPage(1)} disabled={currentPage === 1} icon={faAngleDoubleLeft} />
                                    <PaginationButton onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} icon={faAngleLeft} />

                                    <div className="flex gap-1">
                                        {[...Array(totalPages)].map((_, i) => (
                                            <PaginationButton key={i + 1} onClick={() => goToPage(i + 1)}>
                                                {i + 1}
                                            </PaginationButton>
                                        ))}
                                        <span className="sm:hidden text-emerald-600 px-2 flex items-center">Trang {currentPage}</span>
                                    </div>

                                    <PaginationButton onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} icon={faAngleRight} />
                                    <PaginationButton onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages} icon={faAngleDoubleRight} />
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Modal */}
            <CategoryModal
                isOpen={modal.isOpen}
                onClose={() => setModal({ isOpen: false, mode: 'add', selectedCategory: null })}
                mode={modal.mode}
                initialData={modal.selectedCategory}
                onSave={handlers.save}
                getBranches={api.getBranches}
            />
        </div>
    );
};

export default CategoryManagement;