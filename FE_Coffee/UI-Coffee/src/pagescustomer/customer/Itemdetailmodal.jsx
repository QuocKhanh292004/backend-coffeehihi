import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

const ItemDetailModal = ({ item, onClose, onAddToCart }) => {
    const [quantity, setQuantity] = useState(1);
    const [iceOption, setIceOption] = useState('');
    const [note, setNote] = useState('');

    if (!item) return null;

    const handleAdd = () => {
        onAddToCart({ ...item, quantity, iceOption, note });
        onClose();
    };

    return (
        /* Overlay – click ra ngoài để đóng */
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            {/* Modal – click bên trong không đóng */}
            <div
                className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Nút đóng */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full shadow flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                    <FontAwesomeIcon icon={faTimes} className="text-gray-500 text-sm" />
                </button>

                {/* Ảnh + tên */}
                <div className="relative h-48 overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-10">
                        <h3 className="font-bold text-xl text-white drop-shadow">{item.name}</h3>
                        <p className="text-sm text-white/80">{item.category}</p>
                    </div>
                </div>

                <div className="p-5 space-y-4">
                    {/* Giá */}
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm">Đơn giá</span>
                        <span className="text-xl font-bold text-pink-600">
                            {item.price.toLocaleString('vi-VN')} ₫
                        </span>
                    </div>

                    {/* Tùy chọn đá */}
                    <div>
                        <p className="text-xs font-semibold text-gray-700 mb-2">Lượng đá:</p>
                        <div className="flex gap-2">
                            {['Không đá', 'Ít đá', 'Nhiều đá'].map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => setIceOption(iceOption === opt ? '' : opt)}
                                    className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all border-2 ${
                                        iceOption === opt
                                            ? 'border-pink-400 bg-pink-50 text-pink-600'
                                            : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-pink-200'
                                    }`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Ghi chú */}
                    <div>
                        <p className="text-xs font-semibold text-gray-700 mb-2">Ghi chú:</p>
                        <input
                            type="text"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Nhập ghi chú cho món..."
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                        />
                    </div>

                    {/* Số lượng */}
                    <div className="flex items-center justify-between bg-gray-50 rounded-2xl px-4 py-3">
                        <span className="text-sm font-semibold text-gray-600">Số lượng</span>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                className="w-9 h-9 bg-white rounded-full shadow hover:bg-pink-50 transition-all flex items-center justify-center"
                            >
                                <FontAwesomeIcon icon={faMinus} className="text-gray-600 text-xs" />
                            </button>
                            <span className="text-xl font-bold text-gray-800 min-w-[2rem] text-center">
                                {quantity}
                            </span>
                            <button
                                onClick={() => setQuantity((q) => q + 1)}
                                className="w-9 h-9 bg-white rounded-full shadow hover:bg-pink-50 transition-all flex items-center justify-center"
                            >
                                <FontAwesomeIcon icon={faPlus} className="text-gray-600 text-xs" />
                            </button>
                        </div>
                    </div>

                    {/* Nút thêm giỏ */}
                    <button
                        onClick={handleAdd}
                        className="w-full py-3.5 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-800 font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Thêm vào giỏ — {(item.price * quantity).toLocaleString('vi-VN')} ₫
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ItemDetailModal;