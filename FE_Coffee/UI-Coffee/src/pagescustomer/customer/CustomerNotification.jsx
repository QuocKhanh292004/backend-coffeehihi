import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faXmark } from '@fortawesome/free-solid-svg-icons';
import socket from '../../utils/socket.js';
import { STATUS_CONFIG } from '../../constants/constant.js';

// ─── Toast component ─────────────────────────────────────────
function Toast({ notification, onClose }) {
    const cfg = STATUS_CONFIG[notification.new_status] ?? STATUS_CONFIG.pending;

    useEffect(() => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            className={`flex items-start gap-3 px-4 py-3 rounded-2xl shadow-2xl border ${cfg.bg} ${cfg.border} min-w-[280px] max-w-sm animate-slide-in`}>
            <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.color} bg-white shadow-sm`}>
                <FontAwesomeIcon icon={cfg.icon} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800">{notification.message}</p>
                <p className={`text-xs font-semibold mt-0.5 ${cfg.color}`}>{cfg.label}</p>
            </div>
            <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 flex-shrink-0 mt-0.5"
            >
                <FontAwesomeIcon icon={faXmark} className="text-xs" />
            </button>
        </div>
    );
}

// ─── CustomerNotification chính ──────────────────────────────
function CustomerNotification({ branch_id, table_id }) {
    const [open, setOpen] = useState(false);
    const [notifications, setNoti] = useState([]);
    const [toasts, setToasts] = useState([]);
    const dropdownRef = useRef(null);
    const seenRef = useRef({ set: new Set(), queue: [] });

    // ✅ Socket: connect + join branch + join table
    useEffect(() => {
        if (!socket.connected) socket.connect();

        const joinRooms = () => {
            if (branch_id) {
                socket.emit('join_branch', branch_id);
            }
            if (table_id) {
                socket.emit('join_table', table_id);
            }
        };

        if (socket.connected) joinRooms();
        socket.off('connect', joinRooms);
        socket.on('connect', joinRooms);

        // ✅ Lắng nghe cập nhật trạng thái đơn hàng
        const handleStatusUpdate = (data) => {
            console.log('📦 Order status updated:', data);

            const keyParts = [
                data.notification_id,
                data.order_id,
                data.new_status,
                data.timestamp,
                data.message,
            ].filter(Boolean);
            const key = keyParts.length ? keyParts.join('|') : JSON.stringify(data);

            const { set, queue } = seenRef.current;
            if (set.has(key)) return;
            set.add(key);
            queue.push(key);
            if (queue.length > 50) {
                const old = queue.shift();
                if (old) set.delete(old);
            }

            const noti = {
                id: Date.now(),
                ...data,
                read: false,
                timestamp: data.timestamp ?? new Date().toISOString(),
            };

            // Thêm vào danh sách
            setNoti(prev => [noti, ...prev].slice(0, 20));

            // Hiện toast
            setToasts(prev => [...prev, noti]);
        };

        socket.off('order_status_updated', handleStatusUpdate);
        socket.on('order_status_updated', handleStatusUpdate);

        return () => {
            socket.off('connect', joinRooms);
            socket.off('order_status_updated', handleStatusUpdate);
        };
    }, [branch_id, table_id]);

    // ✅ Đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAllRead = () => {
        setNoti(prev => prev.map(n => ({ ...n, read: true })));
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    const formatTime = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        const now = new Date();
        const diff = Math.floor((now - d) / 1000);
        if (diff < 60) return 'Vừa xong';
        if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
        return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <>
            {/* ── Nút chuông ── */}
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => {
                        setOpen(o => !o);
                        if (!open) markAllRead();
                    }}
                    className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition-all relative shadow-sm"
                >
                    <FontAwesomeIcon icon={faBell} className="text-[16px]" />
                    {unreadCount > 0 && (
                        <span
                            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-white">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </button>

                {/* ── Dropdown ── */}
                {open && (
                    <div
                        className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h3 className="font-black text-slate-800 text-sm">Trạng thái đơn hàng</h3>
                                {notifications.length > 0 && (
                                    <p className="text-xs text-slate-400">{notifications.length} thông báo</p>
                                )}
                            </div>
                            <button
                                onClick={() => setOpen(false)}
                                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400"
                            >
                                <FontAwesomeIcon icon={faXmark} className="text-xs" />
                            </button>
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                                    <FontAwesomeIcon icon={faBell} className="text-3xl mb-3 opacity-30" />
                                    <p className="text-sm font-medium">Chưa có cập nhật nào</p>
                                </div>
                            ) : (
                                notifications.map((noti) => {
                                    const cfg = STATUS_CONFIG[noti.new_status] ?? STATUS_CONFIG.pending;
                                    return (
                                        <div
                                            key={noti.id}
                                            className={`px-5 py-4 border-b border-slate-50 flex gap-3 items-start ${!noti.read ? cfg.bg : ''}`}
                                        >
                                            <div
                                                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-white shadow-sm ${cfg.color}`}>
                                                <FontAwesomeIcon icon={cfg.icon} className="text-sm" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-slate-800 leading-snug">
                                                    {noti.message}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`text-[11px] font-semibold ${cfg.color}`}>
                                                        {cfg.label}
                                                    </span>
                                                    <span className="text-[11px] text-slate-400">
                                                        · {formatTime(noti.timestamp)}
                                                    </span>
                                                </div>
                                            </div>
                                            {!noti.read && (
                                                <span
                                                    className={`w-2 h-2 rounded-full flex-shrink-0 mt-2 ${cfg.dot}`}></span>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* ── Toast stack (góc dưới phải) ── */}
            <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 items-end">
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        notification={toast}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </div>

            {/* ── CSS animation ── */}
            <style>{`
                @keyframes slide-in {
                    from { opacity: 0; transform: translateX(100%); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                .animate-slide-in {
                    animation: slide-in 0.3s ease-out;
                }
            `}</style>
        </>
    );
}

export default CustomerNotification;