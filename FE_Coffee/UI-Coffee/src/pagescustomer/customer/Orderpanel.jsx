import React, { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus, faTrash, faShoppingBag, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { createOrderService } from '../../apiServices/ordersServices.js';

const OrderPanel = ({ cart, total, onUpdateQuantity, onRemoveFromCart, onSubmitOrder, table_id, branch_id }) => {
    const [loading, setLoading] = useState(false);
    const [orderNote, setOrderNote] = useState('');

    const handleSubmit = async () => {
        if (cart.length === 0) return;
        if (!table_id) {
            alert("Vui lòng chọn bàn trước khi gửi đơn!");
            return;
        }

        setLoading(true);
        try {
            const order_items = cart.map(item => ({
                item_id: Number(item.id),
                quantity: Number(item.quantity),
            }));

            const payload = {
                table_id: Number(table_id),
                branch_id: Number(branch_id),
                notes: orderNote,
                order_items: order_items,
            };

            const orderRes = await createOrderService(payload);


            const orderId = orderRes?.data?.order_id;
            console.log('✅ Order created, orderId hhhhhhh:', orderId);

            alert('Đã gửi đơn hàng thành công!');
            onSubmitOrder?.();
            setOrderNote('');

        } catch (err) {
            console.error('Lỗi chi tiết từ Server:', err.response?.data || err);
            const errorMsg = err.response?.data?.message || 'Gửi đơn thất bại, vui lòng thử lại.';
            alert(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full lg:w-96 xl:w-[28rem] bg-white shadow-2xl flex flex-col">
            {/* Order Header */}
            <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-orange-400 rounded-xl flex items-center justify-center">
                        <FontAwesomeIcon icon={faShoppingBag} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Giỏ hàng</h2>
                        <p className="text-xs text-gray-500">
                            {cart.reduce((sum, i) => sum + i.quantity, 0)} sản phẩm
                        </p>
                    </div>
                </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
                {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <div className="text-6xl mb-4">🛒</div>
                        <p className="text-sm font-medium">Giỏ hàng trống</p>
                        <p className="text-xs mt-1">Nhấn vào sản phẩm để thêm món</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {cart.map((item) => (
                            <div key={item.id} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors group">
                                <div className="flex gap-3">
                                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-gray-800 text-sm truncate mb-1">{item.name}</h4>
                                        <p className="text-xs text-gray-500 mb-1">{item.price.toLocaleString('vi-VN')} ₫</p>
                                        {item.iceOption && <p className="text-xs text-blue-500 mb-1">🧊 {item.iceOption}</p>}
                                        {item.note && <p className="text-xs text-gray-400 italic mb-2">📝 {item.note}</p>}
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 bg-white rounded-lg shadow-sm hover:shadow-md hover:bg-pink-50 transition-all flex items-center justify-center">
                                                <FontAwesomeIcon icon={faMinus} className="text-gray-600 text-xs" />
                                            </button>
                                            <span className="text-sm font-bold text-gray-800 min-w-[2rem] text-center">{item.quantity}</span>
                                            <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 bg-white rounded-lg shadow-sm hover:shadow-md hover:bg-pink-50 transition-all flex items-center justify-center">
                                                <FontAwesomeIcon icon={faPlus} className="text-gray-600 text-xs" />
                                            </button>
                                        </div>
                                    </div>
                                    <button onClick={() => onRemoveFromCart(item.id)} className="opacity-0 group-hover:opacity-100 transition-opacity self-start p-2 hover:bg-red-50 rounded-lg">
                                        <FontAwesomeIcon icon={faTrash} className="text-red-400 hover:text-red-600 text-sm" />
                                    </button>
                                </div>
                                <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                                    <span className="text-xs text-gray-500">Tạm tính:</span>
                                    <span className="text-sm font-bold text-pink-600">{(item.price * item.quantity).toLocaleString('vi-VN')} ₫</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Order Summary */}
            {cart.length > 0 && (
                <div className="border-t border-gray-100 px-6 py-6 bg-gradient-to-br from-gray-50 to-white">
                    <div className="space-y-3 mb-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Tạm tính:</span>
                            <span className="font-semibold text-gray-800">{total.toLocaleString('vi-VN')} ₫</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Giảm giá:</span>
                            <span className="font-semibold text-green-600">- 0 ₫</span>
                        </div>
                        <div className="h-px bg-gray-200"></div>
                        <div className="flex justify-between items-center">
                            <span className="text-base font-bold text-gray-800">Tổng cộng:</span>
                            <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">{total.toLocaleString('vi-VN')} ₫</span>
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
                        className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        <FontAwesomeIcon icon={faPaperPlane} />
                        {loading ? 'Đang gửi...' : 'Gửi đơn hàng'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default OrderPanel;