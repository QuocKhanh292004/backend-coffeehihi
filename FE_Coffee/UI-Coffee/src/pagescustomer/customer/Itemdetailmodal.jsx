import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';

// ===== Dữ liệu topping (có thể chuyển ra file config riêng sau) =====
const TOPPINGS = [
    { id: 'jelly', name: 'Thạch', price: 5000 },
    { id: 'pearl', name: 'Trân châu', price: 7000 },
    { id: 'coconut', name: 'Nước cốt dừa', price: 8000 },
    { id: 'cheese', name: 'Cheese foam', price: 10000 },
    { id: 'pudding', name: 'Pudding', price: 8000 },
];

// ===== Tùy chọn đá =====
const ICE_OPTIONS = [
    { label: 'Không đá', icon: '🚫' },
    { label: 'Ít đá',    icon: '🧊' },
    { label: 'Nhiều đá', icon: '❄️'  },
];

const ItemDetailModal = ({ item, onClose, onAddToCart }) => {
    const [quantity, setQuantity]     = useState(1);
    const [iceOption, setIceOption]   = useState('');
    const [note, setNote]             = useState('');
    const [toppings, setToppings]     = useState([]); // array of topping ids

    if (!item) return null;

    const toggleTopping = (id) => {
        setToppings(prev =>
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        );
    };

    const selectedToppings = TOPPINGS.filter(t => toppings.includes(t.id));
    const toppingTotal     = selectedToppings.reduce((sum, t) => sum + t.price, 0);
    const unitPrice        = item.price + toppingTotal;
    const totalPrice       = unitPrice * quantity;

    const handleAdd = () => {
        onAddToCart({
            ...item,
            price: unitPrice,           // giá đã gộp topping
            quantity,
            iceOption,
            note,
            toppings: selectedToppings, // lưu để hiển thị trong giỏ
        });
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-sm sm:mx-4 overflow-hidden max-h-[92dvh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Drag handle (mobile) */}
                <div className="sm:hidden w-10 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-0 flex-shrink-0" />

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full shadow flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                    <FontAwesomeIcon icon={faTimes} className="text-gray-500 text-sm" />
                </button>

                {/* Image + name */}
                <div className="relative h-44 overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-10">
                        <h3 className="font-bold text-xl text-white drop-shadow">{item.name}</h3>
                        <p className="text-sm text-white/80">{item.category}</p>
                    </div>
                </div>

                {/* Scrollable body */}
                <div className="overflow-y-auto flex-1 p-5 space-y-4">

                    {/* Giá gốc */}
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm">Giá gốc</span>
                        <span className="text-lg font-bold text-gray-700">
                            {item.price.toLocaleString('vi-VN')} ₫
                        </span>
                    </div>

                    {/* ===== Tùy chọn đá ===== */}
                    <div>
                        <p className="text-xs font-semibold text-gray-700 mb-2">Lượng đá:</p>
                        <div className="flex gap-2">
                            {ICE_OPTIONS.map(({ label, icon }) => (
                                <button
                                    key={label}
                                    onClick={() => setIceOption(iceOption === label ? '' : label)}
                                    className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all border-2 flex flex-col items-center gap-0.5 ${
                                        iceOption === label
                                            ? 'border-pink-400 bg-pink-50 text-pink-600'
                                            : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-pink-200'
                                    }`}
                                >
                                    <span className="text-base">{icon}</span>
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ===== Topping ===== */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-semibold text-gray-700">Topping:</p>
                            <span className="text-xs text-gray-400">Chọn nhiều</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {TOPPINGS.map((topping) => {
                                const active = toppings.includes(topping.id);
                                return (
                                    <button
                                        key={topping.id}
                                        onClick={() => toggleTopping(topping.id)}
                                        className={`relative flex items-center justify-between px-3 py-2.5 rounded-xl border-2 transition-all text-left ${
                                            active
                                                ? 'border-pink-400 bg-pink-50'
                                                : 'border-gray-100 bg-gray-50 hover:border-pink-200'
                                        }`}
                                    >
                                        <div>
                                            <p className={`text-xs font-semibold leading-tight ${active ? 'text-pink-600' : 'text-gray-700'}`}>
                                                {topping.name}
                                            </p>
                                            <p className={`text-[11px] mt-0.5 ${active ? 'text-pink-400' : 'text-gray-400'}`}>
                                                +{topping.price.toLocaleString('vi-VN')} ₫
                                            </p>
                                        </div>
                                        {/* Checkbox indicator */}
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-1 transition-all ${
                                            active ? 'bg-pink-500 border-pink-500' : 'border-gray-300'
                                        }`}>
                                            {active && <FontAwesomeIcon icon={faCheck} className="text-white text-[9px]" />}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Tổng topping */}
                        {toppingTotal > 0 && (
                            <div className="mt-2 px-3 py-2 bg-amber-50 rounded-xl flex justify-between items-center">
                                <span className="text-xs text-amber-700 font-medium">
                                    Topping ({selectedToppings.length}):
                                </span>
                                <span className="text-xs font-bold text-amber-600">
                                    +{toppingTotal.toLocaleString('vi-VN')} ₫
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Ghi chú */}
                    {/*<div>*/}
                    {/*    <p className="text-xs font-semibold text-gray-700 mb-2">Ghi chú:</p>*/}
                    {/*    <input*/}
                    {/*        type="text"*/}
                    {/*        value={note}*/}
                    {/*        onChange={(e) => setNote(e.target.value)}*/}
                    {/*        placeholder="Nhập ghi chú cho món..."*/}
                    {/*        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"*/}
                    {/*    />*/}
                    {/*</div>*/}

                    {/* Số lượng + đơn giá sau topping */}
                    <div className="bg-gray-50 rounded-2xl px-4 py-3 space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-600">Số lượng</span>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    className="w-9 h-9 bg-white rounded-full shadow hover:bg-pink-50 transition-all flex items-center justify-center"
                                >
                                    <FontAwesomeIcon icon={faMinus} className="text-gray-600 text-xs" />
                                </button>
                                <span className="text-xl font-bold text-gray-800 min-w-[2rem] text-center">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(q => q + 1)}
                                    className="w-9 h-9 bg-white rounded-full shadow hover:bg-pink-50 transition-all flex items-center justify-center"
                                >
                                    <FontAwesomeIcon icon={faPlus} className="text-gray-600 text-xs" />
                                </button>
                            </div>
                        </div>

                        {/* Đơn giá đã gộp topping */}
                        {toppingTotal > 0 && (
                            <div className="flex justify-between items-center pt-1 border-t border-gray-200">
                                <span className="text-xs text-gray-500">Đơn giá (đã gồm topping)</span>
                                <span className="text-sm font-semibold text-gray-700">
                                    {unitPrice.toLocaleString('vi-VN')} ₫
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* ===== Nút thêm giỏ (sticky bottom) ===== */}
                <div className="px-5 pb-5 pt-2 flex-shrink-0 bg-white">
                    <button
                        onClick={handleAdd}
                        className="w-full py-3.5 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-800 font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-between px-5"
                    >
                        <span>Thêm vào giỏ</span>
                        <span className="text-base font-extrabold">
                            {totalPrice.toLocaleString('vi-VN')} ₫
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ItemDetailModal;