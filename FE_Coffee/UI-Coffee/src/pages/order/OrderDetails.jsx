import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faClock, faTruckFast, faCircleCheck, faXmark,
    faReceipt, faPenToSquare, faSpinner
} from "@fortawesome/free-solid-svg-icons";
import { getOrderDetailService, updateOrderStatusService } from "../../apiServices/ordersServices.js";

const statusOrder = [
    { key: "pending",   name: "Chờ xác nhận", icon: faClock },
    { key: "confirmed", name: "Đã xác nhận",  icon: faTruckFast },
    { key: "completed", name: "Đã hoàn thành",icon: faCircleCheck },
];

function OrderDetails({ order, onClose, onStatusChange }) {
    const [detail, setDetail]     = useState(null);
    const [loading, setLoading]   = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchDetail = async () => {
            setLoading(true);
            try {
                const res = await getOrderDetailService(order.order_id);
                setDetail(res?.data?.order ?? res?.data ?? null);
            } catch (err) {
                console.error("Lỗi lấy chi tiết đơn:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [order.order_id]);

    const handleUpdateStatus = async (newStatus) => {
        setUpdating(true);
        try {
            await updateOrderStatusService(order.order_id, newStatus);
            // ✅ Cập nhật đúng field order_status
            setDetail(prev => prev ? { ...prev, order_status: newStatus } : prev);
            onStatusChange?.();
        } catch (err) {
            console.error("Lỗi cập nhật trạng thái:", err);
            alert("Cập nhật thất bại, vui lòng thử lại.");
        } finally {
            setUpdating(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        const d = new Date(dateStr);
        return `${d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })} ${d.toLocaleDateString("vi-VN")}`;
    };

    const formatMoney = (amount) =>
        amount != null ? Number(amount).toLocaleString("vi-VN") + " ₫" : "—";

    const data   = detail ?? order;
    const items  = detail?.OrderItems ?? detail?.items ?? [];

    // ✅ Đọc đúng field order_status (không phải status)
    const status = data?.order_status ?? "pending";
    const currentStatusIndex = statusOrder.findIndex(s => s.key === status);

    const subTotal = items.reduce((sum, item) => {
        const price = Number(item.menuItem?.price ?? item.MenuItem?.price ?? item.price ?? 0);
        const qty   = Number(item.quantity ?? 1);
        return sum + price * qty;
    }, 0);

    return (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="max-w-4xl w-full bg-white rounded-[2.5rem] shadow-2xl relative overflow-hidden">

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-all"
                >
                    <FontAwesomeIcon icon={faXmark} />
                </button>

                {loading ? (
                    <div className="flex items-center justify-center h-64 text-indigo-500">
                        <FontAwesomeIcon icon={faSpinner} spin size="2x" />
                    </div>
                ) : (
                    <div className="flex flex-col md:flex-row h-full max-h-[85vh]">

                        {/* CỘT TRÁI */}
                        <div className="flex-1 p-8 border-r border-slate-100 overflow-y-auto">

                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                                    <FontAwesomeIcon icon={faReceipt} size="lg" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-black text-slate-800 tracking-tight">
                                        Đơn hàng #{data.order_id}
                                    </h1>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                        {/* ✅ Dùng order_time — đúng tên cột trong model */}
                                        {formatDate(data.order_time ?? data.createdAt ?? data.created_at)}
                                        {(data.Branch?.branch_name ?? data.branch_name) && (
                                            <span className="ml-2">· {data.Branch?.branch_name ?? data.branch_name}</span>
                                        )}
                                        {(data.Table?.table_name ?? data.table_name) && (
                                            <span className="ml-2">· {data.Table?.table_name ?? data.table_name}</span>
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* Stepper */}
                            <div className="mb-10 px-2">
                                <div className="flex justify-between relative">
                                    <div className="absolute top-4 left-0 w-full h-[2px] bg-slate-100 z-0"></div>
                                    <div
                                        className="absolute top-4 left-0 h-[2px] bg-indigo-500 z-0 transition-all duration-700"
                                        style={{ width: `${(Math.max(currentStatusIndex, 0) / (statusOrder.length - 1)) * 100}%` }}
                                    ></div>
                                    {statusOrder.map((step, index) => (
                                        <div key={index} className="relative z-10 flex flex-col items-center">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 transition-all duration-500
                                                ${index <= currentStatusIndex
                                                ? "bg-indigo-500 border-white text-white shadow-md"
                                                : "bg-white border-slate-100 text-slate-300"}`}
                                            >
                                                <FontAwesomeIcon icon={step.icon} className="text-[10px]" />
                                            </div>
                                            <span className={`mt-2 text-[10px] font-black uppercase tracking-tighter
                                                ${index === currentStatusIndex ? "text-slate-800" : "text-slate-400"}`}
                                            >
                                                {step.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Danh sách món */}
                            <div>
                                <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Danh sách món</h2>
                                <div className="bg-slate-50/50 rounded-3xl p-2 border border-slate-100">
                                    {items.length === 0 ? (
                                        <p className="text-center text-sm text-slate-400 py-6">Không có món nào</p>
                                    ) : (
                                        <table className="w-full text-left">
                                            <tbody className="divide-y divide-slate-100">
                                            {items.map((item, idx) => {
                                                // ✅ Đọc đúng alias menuItem (chữ thường) theo service
                                                const name  = item.menuItem?.item_name ?? item.MenuItem?.item_name ?? item.item_name ?? "—";
                                                const img   = item.menuItem?.item_image ?? item.MenuItem?.item_image ?? null;
                                                const price = Number(item.menuItem?.price ?? item.MenuItem?.price ?? item.price ?? 0);
                                                const qty   = Number(item.quantity ?? 1);
                                                const note  = item.note ?? null;

                                                return (
                                                    <tr key={idx}>
                                                        <td className="py-3 px-2">
                                                            <div className="flex items-center gap-3">
                                                                {img ? (
                                                                    <img src={img} alt={name} className="w-10 h-10 rounded-xl object-cover shadow-sm flex-shrink-0" />
                                                                ) : (
                                                                    <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center text-slate-400 text-xs flex-shrink-0">?</div>
                                                                )}
                                                                <div>
                                                                    <p className="font-bold text-slate-700 text-sm leading-tight">{name}</p>
                                                                    {note && <p className="text-[10px] text-rose-500 italic font-medium">"{note}"</p>}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-2 text-center font-black text-slate-400 text-xs">x{qty}</td>
                                                        <td className="py-3 px-2 text-right font-bold text-slate-800 text-sm">{formatMoney(price * qty)}</td>
                                                    </tr>
                                                );
                                            })}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* CỘT PHẢI */}
                        <div className="w-full md:w-80 bg-slate-50/80 p-8 flex flex-col justify-between">
                            <div>
                                {/* Ghi chú */}
                                <div className="mb-8">
                                    <div className="flex items-center gap-2 mb-3 text-slate-800">
                                        <FontAwesomeIcon icon={faPenToSquare} className="text-indigo-500" />
                                        <h3 className="text-sm font-black uppercase tracking-wider">Ghi chú đơn</h3>
                                    </div>
                                    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                                        <p className="text-xs text-slate-500 leading-relaxed italic">
                                            {/* field order_note */}
                                            {data.order_note
                                                ? `"${data.order_note}"`
                                                : "Không có ghi chú nào."}
                                        </p>
                                    </div>
                                </div>

                                {/* Tổng tiền */}
                                <div className="space-y-3 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                                    <div className="flex justify-between text-xs font-medium text-slate-400">
                                        <span>Tạm tính</span>
                                        <span className="text-slate-700">{formatMoney(subTotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-medium text-slate-400">
                                        <span>Giảm giá</span>
                                        <span className="text-emerald-500">0 ₫</span>
                                    </div>
                                    <div className="h-[1px] bg-slate-100 my-2"></div>
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-black uppercase text-indigo-500 tracking-widest">Thanh toán</span>
                                        <span className="text-xl font-black text-slate-900 leading-none">
                                            {formatMoney(data.total_price ?? data.total ?? subTotal)}
                                        </span>
                                    </div>
                                </div>

                                {/* Action buttons — dùng order_status, đơn confirmed không hiện nút xác nhận */}
                                <div className="mt-6 space-y-2">
                                    {status === "pending" && (
                                        <button
                                            onClick={() => handleUpdateStatus("confirmed")}
                                            disabled={updating}
                                            className="w-full py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all disabled:opacity-50"
                                        >
                                            {updating ? "Đang xác nhận..." : "✓ Xác nhận đơn"}
                                        </button>
                                    )}
                                    {status === "confirmed" && (
                                        <button
                                            onClick={() => handleUpdateStatus("completed")}
                                            disabled={updating}
                                            className="w-full py-3 bg-green-600 text-white rounded-2xl font-bold text-sm hover:bg-green-700 transition-all disabled:opacity-50"
                                        >
                                            {updating ? "Đang cập nhật..." : "✓ Hoàn thành"}
                                        </button>
                                    )}
                                    {(status === "pending" || status === "confirmed") && (
                                        <button
                                            onClick={() => handleUpdateStatus("cancelled")}
                                            disabled={updating}
                                            className="w-full py-3 bg-white border border-red-200 text-red-500 rounded-2xl font-bold text-sm hover:bg-red-50 transition-all disabled:opacity-50"
                                        >
                                            Huỷ đơn
                                        </button>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={onClose}
                                className="mt-6 w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-700 transition-all active:scale-95"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default OrderDetails;