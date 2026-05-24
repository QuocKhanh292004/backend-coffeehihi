import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus, faTrash, faShoppingBag, faPaperPlane, faTimes } from '@fortawesome/free-solid-svg-icons';
import { createOrderService } from '../../apiServices/ordersServices.js';

// ─── Success Modal ────────────────────────────────────────────────────────────
const SuccessModal = ({ onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
        <div className="bg-white rounded-2xl shadow-2xl px-8 py-10 flex flex-col items-center text-center max-w-xs w-full">
            <div className="w-20 h-20 bg-emerald-400 rounded-2xl flex items-center justify-center mb-5 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Yeah!!!</h2>
            <p className="text-gray-500 text-sm mb-6">
                Đơn hàng của bạn đã đặt thành công.<br />Vui lòng chờ lấy nước.
            </p>
            <button
                onClick={onClose}
                className="px-8 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-full transition-all shadow"
            >
                Quay về menu
            </button>
        </div>
    </div>
);

// ─── Cart Item Row ────────────────────────────────────────────────────────────
const CartItem = ({ item, onUpdateQuantity, onRemoveFromCart }) => (
    <div className="bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-colors group">
        <div className="flex gap-3">
            <img
                src={item.image}
                alt={item.name}
                className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-800 text-sm truncate mb-0.5">{item.name}</h4>
                <p className="text-xs text-gray-500 mb-1">{item.price.toLocaleString('vi-VN')} ₫</p>

                {/* Lượng đá */}
                {item.iceOption && (
                    <p className="text-xs text-blue-500 mb-1">🧊 {item.iceOption}</p>
                )}

                {/* Topping */}
                {item.toppings && item.toppings.length > 0 && (
                    <p className="text-xs text-amber-600 mb-1">
                        🍡 {item.toppings.map(t => t.name).join(', ')}
                    </p>
                )}

                {/* Ghi chú từng món */}
                {item.note && item.note.trim() !== '' && (
                    <p className="text-xs text-gray-400 italic mb-1">📝 {item.note}</p>
                )}

                <div className="flex items-center gap-2 mt-1">
                    <button
                        onClick={() => onUpdateQuantity(item._cartKey, item.quantity - 1)}
                        className="w-7 h-7 bg-white rounded-lg shadow-sm hover:shadow-md hover:bg-pink-50 transition-all flex items-center justify-center"
                    >
                        <FontAwesomeIcon icon={faMinus} className="text-gray-600 text-xs" />
                    </button>
                    <span className="text-sm font-bold text-gray-800 min-w-[2rem] text-center">{item.quantity}</span>
                    <button
                        onClick={() => onUpdateQuantity(item._cartKey, item.quantity + 1)}
                        className="w-7 h-7 bg-white rounded-lg shadow-sm hover:shadow-md hover:bg-pink-50 transition-all flex items-center justify-center"
                    >
                        <FontAwesomeIcon icon={faPlus} className="text-gray-600 text-xs" />
                    </button>
                </div>
            </div>
            <button
                onClick={() => onRemoveFromCart(item._cartKey)}
                className="opacity-0 group-hover:opacity-100 transition-opacity self-start p-1.5 hover:bg-red-50 rounded-lg"
            >
                <FontAwesomeIcon icon={faTrash} className="text-red-400 hover:text-red-600 text-xs" />
            </button>
        </div>
        <div className="mt-2 pt-2 border-t border-gray-200 flex justify-between items-center">
            <span className="text-xs text-gray-500">Tạm tính:</span>
            <span className="text-sm font-bold text-pink-600">
                {(item.price * item.quantity).toLocaleString('vi-VN')} ₫
            </span>
        </div>
    </div>
);

// ─── Shared Cart Content ──────────────────────────────────────────────────────
const CartContent = ({ cart, total, onUpdateQuantity, onRemoveFromCart, orderNote, setOrderNote, loading, handleSubmit }) => (
    <>
        <div className="flex-1 overflow-y-auto px-4 py-3">
            {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 py-12">
                    <div className="text-5xl mb-3">🛒</div>
                    <p className="text-sm font-medium">Giỏ hàng trống</p>
                    <p className="text-xs mt-1">Nhấn vào sản phẩm để thêm món</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {cart.map(item => (
                        <CartItem
                            key={item._cartKey}
                            item={item}
                            onUpdateQuantity={onUpdateQuantity}
                            onRemoveFromCart={onRemoveFromCart}
                        />
                    ))}
                </div>
            )}
        </div>

        {cart.length > 0 && (
            <div className="border-t border-gray-100 px-4 py-4 bg-gradient-to-br from-gray-50 to-white flex-shrink-0">
                <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tạm tính:</span>
                        <span className="font-semibold text-gray-800">{total.toLocaleString('vi-VN')} ₫</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Giảm giá:</span>
                        <span className="font-semibold text-green-600">- 0 ₫</span>
                    </div>
                    <div className="h-px bg-gray-200" />
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-800">Tổng cộng:</span>
                        <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
                            {total.toLocaleString('vi-VN')} ₫
                        </span>
                    </div>
                </div>

                <textarea
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    placeholder="Ghi chú đơn hàng... (VD: Không ớt, ít đá)"
                    rows={2}
                    className="w-full mb-3 px-3 py-2 text-sm bg-white border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder-gray-400"
                />

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    <FontAwesomeIcon icon={faPaperPlane} />
                    {loading ? 'Đang gửi...' : 'Gửi đơn hàng'}
                </button>
            </div>
        )}
    </>
);

// ─── Main OrderPanel ──────────────────────────────────────────────────────────
const OrderPanel = ({ cart, total, onUpdateQuantity, onRemoveFromCart, onSubmitOrder, table_id, branch_id }) => {
    const [loading, setLoading]       = useState(false);
    const [orderNote, setOrderNote]   = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0);

    const handleSubmit = async () => {
        if (cart.length === 0) return;
        if (!table_id) {
            alert("Vui lòng chọn bàn trước khi gửi đơn!");
            return;
        }

        setLoading(true);
        try {
            const order_items = cart.map(item => ({
                item_id:  Number(item.id),
                quantity: Number(item.quantity),
                // ✅ Gửi price thực tế (đã gồm topping) để backend lưu đúng
                price:    Number(item.price),
                // ✅ Gửi note từng món
                note:     (item.note && item.note.trim() !== '') ? item.note.trim() : null,
            }));

            const payload = {
                table_id:  Number(table_id),
                branch_id: Number(branch_id),
                // ✅ Ghi chú chung của đơn — field backend nhận là "notes"
                notes:     orderNote.trim(),
                order_items,
            };

            await createOrderService(payload);
            setShowSuccess(true);
            setMobileOpen(false);
            onSubmitOrder?.();
            setOrderNote('');
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Gửi đơn thất bại, vui lòng thử lại.';
            alert(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const sharedProps = { cart, total, onUpdateQuantity, onRemoveFromCart, orderNote, setOrderNote, loading, handleSubmit };

    return (
        <>
            {showSuccess && <SuccessModal onClose={() => setShowSuccess(false)} />}

            {/* ── Desktop side panel (lg+) ── */}
            <div className="hidden lg:flex w-80 xl:w-[26rem] bg-white shadow-2xl flex-col flex-shrink-0">
                <div className="px-5 py-4 border-b border-gray-100 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-pink-400 to-orange-400 rounded-xl flex items-center justify-center">
                            <FontAwesomeIcon icon={faShoppingBag} className="text-white text-sm" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Giỏ hàng</h2>
                            <p className="text-xs text-gray-500">{itemCount} sản phẩm</p>
                        </div>
                    </div>
                </div>
                <CartContent {...sharedProps} />
            </div>

            {/* ── Mobile/Tablet floating button + bottom drawer (< lg) ── */}
            <div className="lg:hidden">
                {!mobileOpen && (
                    <button
                        onClick={() => setMobileOpen(true)}
                        className="fixed bottom-20 right-4 z-40 w-14 h-14 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full shadow-2xl flex items-center justify-center transition-transform active:scale-95"
                    >
                        <FontAwesomeIcon icon={faShoppingBag} className="text-white text-xl" />
                        {itemCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                {itemCount > 9 ? '9+' : itemCount}
                            </span>
                        )}
                    </button>
                )}

                {mobileOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
                        onClick={() => setMobileOpen(false)}
                    />
                )}

                <div
                    className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl flex flex-col transition-transform duration-300 ${
                        mobileOpen ? 'translate-y-0' : 'translate-y-full'
                    }`}
                    style={{ maxHeight: '85dvh' }}
                >
                    <div className="px-5 pt-4 pb-3 border-b border-gray-100 flex-shrink-0">
                        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-gradient-to-br from-pink-400 to-orange-400 rounded-xl flex items-center justify-center">
                                    <FontAwesomeIcon icon={faShoppingBag} className="text-white text-sm" />
                                </div>
                                <div>
                                    <h2 className="text-base font-bold text-gray-800">Giỏ hàng</h2>
                                    <p className="text-xs text-gray-500">{itemCount} sản phẩm</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setMobileOpen(false)}
                                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                            >
                                <FontAwesomeIcon icon={faTimes} className="text-gray-600 text-sm" />
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col flex-1 overflow-hidden">
                        <CartContent {...sharedProps} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderPanel;