import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEdit, faTrashAlt, faSearch, faPlus,
    faAngleLeft, faAngleRight, faAngleDoubleLeft, faAngleDoubleRight
} from '@fortawesome/free-solid-svg-icons';
import usePagination from '../../hook/usePagination.js';
import AccountModal from './AccountModal.jsx';
import { getAllUsers, branchUsers, removeBranch } from '../../apiServices/usersServices.js';
import { getBranches } from '../../apiServices/branchesServices.js';

// Map role_name API → tiếng Việt
const formatRoleName = (role) => {
    const map = { admin: 'Admin', manager: 'Quản lý', staff: 'Nhân viên' };
    return map[role?.toLowerCase()] || role || 'Nhân viên';
};

// Chuẩn hoá 1 object user từ API thành format dùng trong UI
const formatUser = (user) => ({
    id:       user.user_id,
    username: user.user_name,
    role:     user.role?.role_name || '',
    role_id:  user.role_id,
    email:    user.email,
    phone:    user.user_phone    || '',
    address:  user.user_address  || '',
    branches: user.branch_names  || '',
    isLocked: user.lock_up       || false,
});

function Account() {
    const [allAccounts, setAllAccounts]   = useState([]);   // toàn bộ user từ GET /users
    const [displayList, setDisplayList]   = useState([]);   // danh sách đang hiện (all hoặc theo branch)
    const [branches, setBranches]         = useState([]);
    const [loading, setLoading]           = useState(false);

    const [filters, setFilters] = useState({ username: '', branchId: '' });
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [isModalOpen, setIsModalOpen]   = useState(false);
    const [modalMode, setModalMode]       = useState('add');
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [selectedBranch, setSelectedBranch] = useState('');

    // ─── Load ban đầu ─────────────────────────────────────────────────────────
    useEffect(() => {
        loadBranches();
        loadAllUsers();
    }, []);

    // ─── Khi đổi chi nhánh: load theo branch hoặc hiện lại toàn bộ ──────────
    useEffect(() => {
        if (filters.branchId) {
            loadAccountsByBranch(filters.branchId);
        } else {
            setDisplayList(allAccounts);
        }
    }, [filters.branchId]);

    // Khi allAccounts thay đổi mà không có branch filter → cập nhật displayList
    useEffect(() => {
        if (!filters.branchId) {
            setDisplayList(allAccounts);
        }
    }, [allAccounts]);

    const loadBranches = async () => {
        try {
            const data = await getBranches();
            setBranches(data || []);
        } catch (error) {
            console.error('Lỗi khi tải danh sách chi nhánh:', error);
        }
    };

    const loadAllUsers = async () => {
        setLoading(true);
        try {
            const data = await getAllUsers();
            const formatted = data.map(formatUser);
            setAllAccounts(formatted);
            // Chỉ set displayList khi không đang lọc theo branch
            if (!filters.branchId) setDisplayList(formatted);
        } catch (error) {
            console.error('Lỗi khi tải danh sách user:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadAccountsByBranch = async (branchId) => {
        setLoading(true);
        try {
            const data = await branchUsers(branchId);
            setDisplayList(data.map(formatUser));
        } catch (error) {
            console.error('Lỗi khi tải tài khoản theo chi nhánh:', error);
            setDisplayList([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        if (filters.branchId) {
            loadAccountsByBranch(filters.branchId);
        } else {
            loadAllUsers();
        }
    };

    // ─── Xóa khỏi chi nhánh ───────────────────────────────────────────────────
    const handleRemoveFromBranch = async (account) => {
        if (!filters.branchId) {
            alert('Vui lòng chọn chi nhánh trước khi xóa.');
            return;
        }
        if (!window.confirm(`Xóa "${account.username}" khỏi chi nhánh này?`)) return;
        try {
            await removeBranch(account.id, Number(filters.branchId));
            alert('Xóa khỏi chi nhánh thành công!');
            await loadAccountsByBranch(filters.branchId);
        } catch (error) {
            console.error('Lỗi khi xóa khỏi chi nhánh:', error);
            alert('Xóa thất bại. Vui lòng thử lại.');
        }
    };

    // ─── Filter tên ──────────────────────────────────────────────────────────
    const filteredAccounts = displayList.filter(account => {
        if (filters.username) {
            return account.username.toLowerCase().includes(filters.username.toLowerCase());
        }
        return true;
    });

    const {
        currentPage, totalPages, totalItems,
        startItem, endItem, currentData, goToPage,
    } = usePagination(filteredAccounts, itemsPerPage);

    const handleOpenAdd = () => {
        setModalMode('add');
        setSelectedAccount(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (account) => {
        setModalMode('update');
        setSelectedAccount(account);
        setIsModalOpen(true);
    };

    // Reload sau khi modal thành công
    const handleModalSuccess = () => {
        if (filters.branchId) {
            loadAccountsByBranch(filters.branchId);
        } else {
            loadAllUsers();
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 bg-white min-h-screen text-slate-700 font-sans">

            {/* Tiêu đề & Nút Thêm */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-slate-800">Quản lý tài khoản</h2>
                <button
                    onClick={handleOpenAdd}
                    className="flex items-center gap-2 bg-[#1e293b] hover:bg-slate-900 text-white px-5 py-2 rounded-lg shadow-md transition-all active:scale-95 text-sm"
                >
                    <FontAwesomeIcon icon={faPlus} /> Thêm Mới
                </button>
            </div>

            {/* Bộ lọc */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
                <input
                    type="text"
                    placeholder="Tên tài khoản"
                    value={filters.username}
                    onChange={(e) => setFilters({ ...filters, username: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg outline-none text-sm bg-slate-50/50"
                />
                <select
                    value={filters.branchId}
                    // onChange={(e) => setFilters({ ...filters, branchId: e.target.value })}
                    onChange={(e) => {
                        const branchId = e.target.value;

                        const branch = branches.find(
                            b => String(b.branch_id) === branchId
                        );

                        setFilters({ ...filters, branchId });
                        setSelectedBranch(branch?.branch_name || '');
                    }}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg outline-none text-sm bg-slate-50/50 text-slate-700"
                >
                    <option value="">-- Tất cả chi nhánh --</option>
                    {branches.map(branch => (
                        <option key={branch.branch_id} value={branch.branch_id}>
                            {branch.branch_name}
                        </option>
                    ))}
                </select>
                <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="bg-[#1e293b] hover:bg-slate-900 text-white rounded-lg font-bold text-sm h-[42px] flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
                >
                    <FontAwesomeIcon icon={faSearch} />
                    {loading ? 'Đang tải...' : 'Tìm Kiếm'}
                </button>
            </div>

            {/* Bảng dữ liệu */}
            <div className="border border-slate-100 rounded-xl shadow-sm overflow-hidden bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[1000px]">
                        <thead>
                        <tr className="bg-slate-50/80 text-slate-600 text-[11px] uppercase tracking-widest font-black">
                            <th className="py-4 px-4 text-left">Tên tài khoản</th>
                            <th className="py-4 px-4 text-left border-x border-slate-100">Loại tài khoản</th>
                            <th className="py-4 px-4 text-left border-r border-slate-100">Email</th>
                            <th className="py-4 px-4 text-left border-r border-slate-100">Chi nhánh quản lý</th>
                            <th className="py-4 px-4 text-center border-r border-slate-100">Khóa tài khoản</th>
                            <th className="py-4 px-4 text-center">Thao tác</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-sm">
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="py-8 text-center text-slate-400">
                                    Đang tải dữ liệu...
                                </td>
                            </tr>
                        ) : currentData.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="py-8 text-center text-slate-400">
                                    Không có dữ liệu
                                </td>
                            </tr>
                        ) : (
                            currentData.map((account) => (
                                <tr key={account.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="py-4 px-4 font-medium text-slate-700">{account.username}</td>
                                    <td className="py-4 px-4 border-x border-slate-50 text-slate-500">
                                        {formatRoleName(account.role)}
                                    </td>
                                    <td className="py-4 px-4 border-r border-slate-50 text-slate-500">{account.email}</td>
                                    <td className="py-4 px-4 border-r border-slate-50 text-slate-500">{selectedBranch}</td>
                                    <td className="py-4 px-4 border-r border-slate-50 text-center">
                                        <input
                                            type="checkbox"
                                            checked={account.isLocked}
                                            readOnly
                                            className="w-4 h-4 rounded border-slate-300 text-slate-800 focus:ring-slate-500 cursor-pointer"
                                        />
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex justify-center gap-4">
                                            <button
                                                onClick={() => handleOpenEdit(account)}
                                                className="text-slate-600 hover:text-slate-900 transition-colors"
                                                title="Chỉnh sửa"
                                            >
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                            <button
                                                onClick={() => handleRemoveFromBranch(account)}
                                                className="text-slate-300 hover:text-red-500 transition-colors"
                                                title="Xóa khỏi chi nhánh"
                                            >
                                                <FontAwesomeIcon icon={faTrashAlt} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                {/* Phân trang */}
                {!loading && currentData.length > 0 && (
                    <div className="px-6 py-4 bg-white border-t border-slate-100 flex flex-col md:flex-row justify-end items-center gap-6 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        <div className="flex items-center gap-2">
                            <span>Tổng số trên 1 trang:</span>
                            <select
                                value={itemsPerPage}
                                onChange={(e) => { setItemsPerPage(Number(e.target.value)); goToPage(1); }}
                                className="bg-transparent border-none focus:ring-0 cursor-pointer text-slate-600 outline-none"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-slate-300">
                                Hiển thị {startItem} - {endItem} trên {totalItems}
                            </span>
                            <div className="flex items-center gap-1">
                                <button onClick={() => goToPage(1)} disabled={currentPage === 1} className="p-2 disabled:opacity-20">
                                    <FontAwesomeIcon icon={faAngleDoubleLeft} />
                                </button>
                                <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="p-2 disabled:opacity-20">
                                    <FontAwesomeIcon icon={faAngleLeft} />
                                </button>
                                <span className="bg-[#1e293b] text-white w-7 h-7 flex items-center justify-center rounded-full shadow-md">
                                    {currentPage}
                                </span>
                                <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 disabled:opacity-20">
                                    <FontAwesomeIcon icon={faAngleRight} />
                                </button>
                                <button onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages} className="p-2 disabled:opacity-20">
                                    <FontAwesomeIcon icon={faAngleDoubleRight} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <AccountModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                mode={modalMode}
                initialData={selectedAccount}
                onSuccess={handleModalSuccess}
                branches={branches}
            />
        </div>
    );
}

export default Account;