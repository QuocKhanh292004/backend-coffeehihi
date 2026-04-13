import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faXmark, faReceipt } from '@fortawesome/free-solid-svg-icons';
import socket from '../../utils/socket.js';
import { getNotificationsService, updateNotificationService } from '../../apiServices/notificationServices.js';
import OrderDetailModal from './OrderDetailModal.jsx';

// ✅ branch_id tuỳ chọn — không có thì lấy tất cả thông báo
function Notification({ branch_id }) {
    const [open, setOpen]                = useState(false);
    const [notifications, setNoti]       = useState([]);
    const [selectedOrderId, setSelected] = useState(null);
    const dropdownRef                    = useRef(null);

    const fetchNotifications = async () => {
        try {
            console.log('📥 Fetching notifications, branch_id:', branch_id ?? 'all');
            // ✅ branch_id có thì truyền, không có thì lấy hết
            const res = await getNotificationsService(branch_id ? { branch_id } : {});
            console.log('📥 Notifications response:', res?.data);
            const list = res?.data?.notifications ?? res?.data ?? [];
            setNoti(Array.isArray(list) ? list : []);
        } catch (err) {
            console.error('Lỗi lấy thông báo:', err.response?.status, err.response?.data);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [branch_id]);

    // ✅ Socket: connect + join room
    useEffect(() => {
        if (!socket.connected) {
            socket.connect();
        }

        const joinRoom = () => {
            if (branch_id) {
                socket.emit('join_branch', branch_id);
                console.log('👉 Joined branch:', branch_id);
            } else {
                // Admin xem hết → join admin_room
                socket.emit('join_admin');
                console.log('👉 Joined admin_room');
            }
        };

        if (socket.connected) {
            joinRoom();
        }
        socket.on('connect', joinRoom);

        const handleNewOrder = (data) => {
            console.log('🔔 New order received:', data);
            setNoti(prev => [data, ...prev]);
        };
        socket.on('new_order', handleNewOrder);

        return () => {
            socket.off('connect', joinRoom);
            socket.off('new_order', handleNewOrder);
        };
    }, [branch_id]);

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

    const handleClickNotification = async (noti) => {
        console.log('noti object:', noti);
        setSelected(noti.related_id ?? noti.order_id);
        setOpen(false);

        if (noti.status_admin !== 'read') {
            try {
                await updateNotificationService(noti.notification_id ?? noti.id, 'read');
                setNoti(prev =>
                    prev.map(n =>
                        (n.notification_id ?? n.id) === (noti.notification_id ?? noti.id)
                            ? { ...n, status_admin: 'read' }
                            : n
                    )
                );
            } catch (err) {
                console.error('Lỗi đánh dấu đã đọc:', err.response?.status, err.response?.data);
            }
        }
    };

    const unreadCount = notifications.filter(n => n.status_admin !== 'read').length;

    const formatTime = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        const now = new Date();
        const diff = Math.floor((now - d) / 1000);
        if (diff < 60)    return 'Vừa xong';
        if (diff < 3600)  return `${Math.floor(diff / 60)} phút trước`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
        return d.toLocaleDateString('vi-VN');
    };

    return (
        <>
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setOpen(o => !o)}
                    className="w-10 h-10 flex items-center justify-center border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 hover:text-indigo-600 text-slate-600 transition-all relative shadow-sm"
                >
                    <FontAwesomeIcon icon={faBell} className="text-[16px]" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-white">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    )}
                </button>

                {open && (
                    <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h3 className="font-black text-slate-800 text-sm">Thông báo</h3>
                                {unreadCount > 0 && (
                                    <p className="text-xs text-slate-400">{unreadCount} chưa đọc</p>
                                )}
                            </div>
                            <button
                                onClick={() => setOpen(false)}
                                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition-all"
                            >
                                <FontAwesomeIcon icon={faXmark} className="text-xs" />
                            </button>
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                                    <FontAwesomeIcon icon={faBell} className="text-3xl mb-3 opacity-30" />
                                    <p className="text-sm font-medium">Chưa có thông báo nào</p>
                                </div>
                            ) : (
                                notifications.map((noti, idx) => {
                                    const isUnread = noti.status_admin !== 'read';
                                    return (
                                        <button
                                            key={noti.notification_id ?? noti.id ?? idx}
                                            onClick={() => handleClickNotification(noti)}
                                            className={`w-full text-left px-5 py-4 border-b border-slate-50 hover:bg-slate-50 transition-colors flex gap-3 items-start ${isUnread ? 'bg-indigo-50/50' : ''}`}
                                        >
                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isUnread ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                                                <FontAwesomeIcon icon={faReceipt} className="text-sm" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm leading-snug ${isUnread ? 'font-bold text-slate-800' : 'font-medium text-slate-600'}`}>
                                                    {noti.message ?? `Đơn hàng mới #${noti.related_id ?? noti.order_id}`}
                                                </p>
                                                <p className="text-xs text-slate-400 mt-0.5">
                                                    {formatTime(noti.createdAt ?? noti.created_at)}
                                                </p>
                                            </div>
                                            {isUnread && (
                                                <span className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0 mt-1.5"></span>
                                            )}
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}
            </div>

            {selectedOrderId && (
                <OrderDetailModal
                    orderId={selectedOrderId}
                    onClose={() => setSelected(null)}
                    onStatusChange={() => fetchNotifications()}
                />
            )}
        </>
    );
}

export default Notification;