import React, { useState, useEffect } from "react";
import Pagination from "./Pagination.jsx";
import usePagination from "../../hook/usePagination.js";
import OrderDetails from "./OrderDetails.jsx";
import { getOrdersService, updateOrderStatusService } from "../../apiServices/ordersServices.js";
import { getBranches } from "../../apiServices/branchesServices.js";
import { getTables } from "../../apiServices/tablesServices.js";

const STATUS_MAP = {
    pending:   { label: "Chờ xác nhận", style: "bg-yellow-400 text-white" },
    confirmed: { label: "Xác nhận",     style: "bg-cyan-500 text-white" },
    completed: { label: "Đã hoàn thành",style: "bg-green-500 text-white" },
    cancelled: { label: "Đã huỷ",       style: "bg-red-500 text-white" },
};

const StatusPill = ({ status }) => {
    const s = STATUS_MAP[status] ?? { label: status, style: "bg-gray-400 text-white" };
    return (
        <span className={`px-4 py-1.5 text-xs font-semibold rounded-full ${s.style}`}>
            {s.label}
        </span>
    );
};

function Order() {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [allOrders, setAllOrders]         = useState([]);
    const [loading, setLoading]             = useState(false);
    const [confirming, setConfirming]       = useState(null);
    const [itemsPerPage, setItemsPerPage]   = useState(10);

    const [branches, setBranches] = useState([]);
    const [tables, setTables]     = useState([]);

    const [selectedBranch, setSelectedBranch] = useState("");
    const [selectedTable, setSelectedTable]   = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [filterDate, setFilterDate]         = useState("");

    useEffect(() => {
        getBranches()
            .then(res => setBranches(res || []))
            .catch(err => console.error("Lỗi lấy chi nhánh:", err));
    }, []);

    useEffect(() => {
        if (!selectedBranch) { setTables([]); setSelectedTable(""); return; }
        getTables(selectedBranch)
            .then(res => setTables(res || []))
            .catch(err => console.error("Lỗi lấy bàn:", err));
    }, [selectedBranch]);

    const fetchOrders = async (branch_id, table_id, status) => {
        setLoading(true);
        try {
            const res = await getOrdersService({
                branch_id: branch_id || undefined,
                table_id:  table_id  || undefined,
                status:    status    || undefined,
            });
            const orders = res?.data?.orders ?? res?.data ?? [];
            setAllOrders(Array.isArray(orders) ? orders : []);
        } catch (err) {
            console.error("Lỗi lấy đơn hàng:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    const handleSearch = () => {
        fetchOrders(selectedBranch, selectedTable, selectedStatus);
    };

    const handleConfirm = async (order) => {
        setConfirming(order.order_id);
        try {
            await updateOrderStatusService(order.order_id, "confirmed");
            await fetchOrders(selectedBranch, selectedTable, selectedStatus);
        } catch (err) {
            alert("Xác nhận thất bại, vui lòng thử lại.");
        } finally {
            setConfirming(null);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        const d = new Date(dateStr);
        return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')} ${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
    };

    const formatMoney = (amount) =>
        amount != null ? Number(amount).toLocaleString("vi-VN") + " đ" : "—";

    const { currentPage, totalPages, totalItems, startItem, endItem, currentData, goToPage } =
        usePagination(allOrders, itemsPerPage);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-800 mb-5">Quản lý đơn hàng</h1>

                {/* Filter Bar */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
                    <div className="flex flex-wrap gap-3 items-end">

                        <div className="flex-1 min-w-[160px]">
                            <select
                                value={selectedBranch}
                                onChange={e => { setSelectedBranch(e.target.value); setSelectedTable(""); }}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Chi nhánh</option>
                                {branches.map(b => (
                                    <option key={b.branch_id} value={b.branch_id}>{b.branch_name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex-1 min-w-[140px]">
                            <select
                                value={selectedTable}
                                onChange={e => setSelectedTable(e.target.value)}
                                disabled={!selectedBranch}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <option value="">Bàn</option>
                                {tables.map(t => (
                                    <option key={t.table_id} value={t.table_id}>{t.table_name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex-1 min-w-[160px]">
                            <select
                                value={selectedStatus}
                                onChange={e => setSelectedStatus(e.target.value)}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Trạng thái</option>
                                {Object.entries(STATUS_MAP).map(([k, v]) => (
                                    <option key={k} value={k}>{v.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex-1 min-w-[180px]">
                            <div className="relative">
                                <label className="absolute -top-2 left-3 text-[10px] text-gray-500 bg-white px-1">Ngày đơn hàng</label>
                                <input
                                    type="date"
                                    value={filterDate}
                                    onChange={e => setFilterDate(e.target.value)}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleSearch}
                            disabled={loading}
                            className="px-6 py-2.5 bg-gray-800 hover:bg-gray-900 text-white text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap disabled:opacity-60"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Tìm Kiếm
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center items-center py-20 text-gray-400">Đang tải đơn hàng...</div>
                    ) : allOrders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                            <div className="text-5xl mb-3">📋</div>
                            <p className="text-base font-medium">Chưa có đơn hàng nào</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        {['Mã đơn', 'Ngày tạo', 'Chi nhánh', 'Bàn', 'Tổng tiền', 'Trạng Thái'].map(h => (
                                            <th key={h} className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                                        ))}
                                        <th className="px-6 py-3.5"></th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                    {currentData.map(order => (
                                        <tr key={order.order_id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-800">{order.order_id}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{formatDate(order.order_time ?? order.createdAt ?? order.created_at)}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700">{order.Branch?.branch_name ?? order.branch_name ?? "—"}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700">{order.Table?.table_name ?? order.table_name ?? "—"}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700">{formatMoney(order.total_price ?? order.total)}</td>
                                            <td className="px-6 py-4"><StatusPill status={order.order_status ?? order.status} /></td>
                                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                                {(order.order_status === "pending" || order.status === "pending") && (
                                                    <button
                                                        onClick={() => handleConfirm(order)}
                                                        disabled={confirming === order.order_id}
                                                        className="text-cyan-600 hover:text-cyan-800 font-medium text-sm mr-3 disabled:opacity-50"
                                                    >
                                                        {confirming === order.order_id ? "..." : "Xác nhận"}
                                                    </button>
                                                )}
                                                <button
                                                    className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                                                    onClick={() => setSelectedOrder(order)}
                                                >
                                                    Chi tiết
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* ✅ Truyền đúng props khớp với Pagination.jsx */}
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalItems={totalItems}
                                startItem={startItem}
                                endItem={endItem}
                                itemsPerPage={itemsPerPage}
                                onPageChange={goToPage}
                                onItemsPerPageChange={(val) => {
                                    setItemsPerPage(val);
                                    goToPage(1);
                                }}
                            />
                        </>
                    )}
                </div>
            </div>

            {selectedOrder && (
                <OrderDetails
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onStatusChange={() => fetchOrders(selectedBranch, selectedTable, selectedStatus)}
                />
            )}
        </div>
    );
}

export default Order;