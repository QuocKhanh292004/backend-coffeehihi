import React, {useState, useEffect} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faPlus,
    faSearch,
    faAngleLeft,
    faAngleRight,
    faAngleDoubleLeft,
    faAngleDoubleRight
} from '@fortawesome/free-solid-svg-icons';
import usePagination from '../../hook/usePagination.js';
import TableModal from './TableModal.jsx';
import {getBranches} from '../../apiServices/branchesServices.js';
import {getTables, deleteTable} from '../../apiServices/tablesServices.js';

function Table() {
    const [allTables, setAllTables] = useState([]);
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchName, setSearchName] = useState('');
    const [filterBranchId, setFilterBranchId] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [selectedTable, setSelectedTable] = useState(null);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const URL_CUSTOMER = import.meta.env.VITE_BASE_URL_CUSTOMER;

    const filteredTables = allTables.filter((t) =>
        t.table_name?.toLowerCase().includes(searchName.toLowerCase())
    );

    const {currentPage, totalPages, totalItems, startItem, endItem, currentData, goToPage} =
        usePagination(filteredTables, itemsPerPage);

    const fetchTables = async (branchId) => {
        if (!branchId) return;
        setLoading(true);
        try {
            const data = await getTables(branchId);
            setAllTables(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Lỗi khi lấy danh sách bàn:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const data = await getBranches();
                const list = Array.isArray(data) ? data : [];
                setBranches(list);
                if (list.length > 0) {
                    const firstId = list[0].branch_id;
                    setFilterBranchId(firstId);
                    fetchTables(firstId);
                }
            } catch (err) {
                console.error('Lỗi khi lấy chi nhánh:', err);
            }
        };
        fetchBranches();
    }, []);

    const handleSearch = () => {
        goToPage(1);
        fetchTables(filterBranchId);
    };
    const handleOpenAdd = () => {
        setModalMode('add');
        setSelectedTable(null);
        setIsModalOpen(true);
    };
    const handleOpenEdit = (table) => {
        setModalMode('update');
        setSelectedTable(table);
        setIsModalOpen(true);
    };

    const handleOpenQr = (table) => {
        setModalMode('qr');
        setSelectedTable(table);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa bàn này?')) {
            try {
                await deleteTable(id);
                fetchTables(filterBranchId);
            } catch {
                alert('Xóa bàn thất bại!');
            }
        }
    };

    const handleModalSuccess = () => {
        setIsModalOpen(false);
        fetchTables(filterBranchId);
    };

    const statusLabel = (status) => {
        if (status === 'available') return {text: 'Còn trống', cls: 'bg-green-50 text-green-600'};
        if (status === 'occupied') return {text: 'Đang dùng', cls: 'bg-red-50 text-red-500'};
        return {text: 'Đã đặt trước', cls: 'bg-yellow-50 text-yellow-600'};
    };

    const buildCustomerUrl = (qrBranchId, tableId) => `${URL_CUSTOMER}/${qrBranchId}/${tableId}`;

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 bg-white min-h-screen text-slate-700 font-sans">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-slate-800">Quản lý bàn</h2>
                <button onClick={handleOpenAdd}
                        className="flex items-center gap-2 bg-[#1e293b] hover:bg-slate-900 text-white px-5 py-2 rounded-lg shadow-md transition-all text-sm font-semibold active:scale-95">
                    <FontAwesomeIcon icon={faPlus} className="text-xs"/>
                    Thêm Mới
                </button>
            </div>

            {/* Filter */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-8">
                <div className="md:col-span-5">
                    <input type="text" placeholder="Tên bàn" value={searchName}
                           onChange={(e) => setSearchName(e.target.value)}
                           className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none text-sm focus:border-slate-400 bg-slate-50/30"/>
                </div>
                <div className="md:col-span-5">
                    <select value={filterBranchId}
                            onChange={(e) => {
                                const id = Number(e.target.value);
                                setFilterBranchId(id);
                                goToPage(1);
                                fetchTables(id);
                            }}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none text-sm focus:border-slate-400 bg-slate-50/30 text-slate-500">
                        {branches.map((b) => (
                            <option key={b.branch_id} value={b.branch_id}>{b.branch_name}</option>
                        ))}
                    </select>
                </div>
                <div className="md:col-span-2">
                    <button onClick={handleSearch}
                            className="w-full h-full bg-[#1e293b] hover:bg-slate-900 text-white py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm">
                        <FontAwesomeIcon icon={faSearch}/> Tìm Kiếm
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="border border-slate-100 rounded-xl shadow-sm overflow-hidden bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[800px]">
                        <thead>
                        <tr className="bg-slate-50 text-slate-600 text-[11px] uppercase tracking-widest font-black">
                            <th className="py-4 px-6 text-left">Tên bàn</th>
                            <th className="py-4 px-6 text-left border-x border-slate-100">Sức chứa</th>
                            <th className="py-4 px-6 text-left border-r border-slate-100">Trạng thái</th>
                            <th className="py-4 px-6 text-left border-r border-slate-100">Chi nhánh</th>
                            <th className="py-4 px-6 text-left border-r border-slate-100">Mã QR</th>
                            <th className="py-4 px-6 text-center w-32">Thao tác</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-sm">
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="py-10 text-center text-slate-400">Đang tải dữ liệu...</td>
                            </tr>
                        ) : currentData.length > 0 ? (
                            currentData.map((table) => {
                                const st = statusLabel(table.status);
                                return (
                                    <tr key={table.table_id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="py-4 px-6 text-slate-700 font-medium">{table.table_name}</td>
                                        <td className="py-4 px-6 border-x border-slate-50 text-slate-500">
                                            {table.capacity ?? '—'} người
                                        </td>
                                        <td className="py-4 px-6 border-r border-slate-50">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${st.cls}`}>
                                                    {st.text}
                                                </span>
                                        </td>
                                        <td className="py-4 px-6 border-r border-slate-50 text-slate-500">
                                            {table.Branch?.branch_name || '—'}
                                        </td>
                                        <td className="py-2 px-6 border-r border-slate-50">
                                            <button
                                                type="button"
                                                onClick={() => handleOpenQr(table)}
                                                className="rounded bg-white hover:bg-slate-50 transition-colors"
                                                title="Xem mã QR"
                                            >
                                                <img
                                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=50x50&data=${encodeURIComponent(buildCustomerUrl(table?.qrBranchId, table.table_id))}`}
                                                    alt={`QR ${table.table_name}`}
                                                    className="w-10 h-10 object-contain border border-slate-100 p-1 rounded bg-white"
                                                />
                                            </button>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex justify-center gap-3">
                                                <button onClick={() => handleOpenEdit(table)}
                                                        className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
                                                        title="Chỉnh sửa">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4"
                                                         viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path
                                                            d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                                        <path
                                                            d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                                    </svg>
                                                </button>
                                                <button onClick={() => handleDelete(table.table_id)}
                                                        className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                        title="Xóa">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4"
                                                         viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="3 6 5 6 21 6"/>
                                                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                                        <path d="M10 11v6M14 11v6"/>
                                                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="6" className="py-10 text-center text-slate-400">Không có dữ liệu bàn</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div
                    className="px-6 py-4 bg-white border-t border-slate-100 flex flex-col md:flex-row justify-end items-center gap-6 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <div className="flex items-center gap-2">
                        <span>Tổng số trên 1 trang:</span>
                        <select value={itemsPerPage}
                                onChange={(e) => {
                                    setItemsPerPage(Number(e.target.value));
                                    goToPage(1);
                                }}
                                className="bg-transparent border-none focus:ring-0 cursor-pointer text-slate-600 outline-none font-bold">
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-4">
                        <span
                            className="text-slate-300">Hiển thị từ {startItem} - {endItem} trên tổng số {totalItems}</span>
                        <div className="flex items-center gap-1">
                            <button onClick={() => goToPage(1)} disabled={currentPage === 1}
                                    className="p-2 disabled:opacity-20 hover:text-slate-600 transition-colors">
                                <FontAwesomeIcon icon={faAngleDoubleLeft}/></button>
                            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}
                                    className="p-2 disabled:opacity-20 hover:text-slate-600 transition-colors">
                                <FontAwesomeIcon icon={faAngleLeft}/></button>
                            <span
                                className="bg-[#1e293b] text-white w-7 h-7 flex items-center justify-center rounded-full shadow-lg">{currentPage}</span>
                            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}
                                    className="p-2 disabled:opacity-20 hover:text-slate-600 transition-colors">
                                <FontAwesomeIcon icon={faAngleRight}/></button>
                            <button onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages}
                                    className="p-2 disabled:opacity-20 hover:text-slate-600 transition-colors">
                                <FontAwesomeIcon icon={faAngleDoubleRight}/></button>
                        </div>
                    </div>
                </div>
            </div>

            <TableModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleModalSuccess}
                mode={modalMode}
                initialData={selectedTable}
                branches={branches}
            />
        </div>
    );
}

export default Table;

