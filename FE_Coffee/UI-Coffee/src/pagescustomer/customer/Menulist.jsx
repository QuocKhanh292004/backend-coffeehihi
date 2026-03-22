import React from 'react';

// ✅ Đổi prop: onAddToCart → onSelectItem (click card mở modal thay vì thêm thẳng)
const MenuList = ({ items, onSelectItem, selectedItem }) => {
    return (
        <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {items.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => onSelectItem(item)}   // ← mở modal
                        className={`group bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 ${
                            selectedItem?.id === item.id
                                ? 'border-pink-400 shadow-lg'
                                : 'border-transparent hover:border-gray-100'
                        }`}
                    >
                        {/* Image */}
                        <div className="relative h-36 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                            <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                                <span className="text-sm font-bold text-pink-600">
                                    {item.price.toLocaleString('vi-VN')} ₫
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1 group-hover:text-pink-600 transition-colors">
                                    {item.name}
                                </h3>
                                <p className="text-xs text-gray-500 line-clamp-1">
                                    Mô tả: {item.desc}
                                </p>
                            </div>
                            <div className="pr-3">
                                <button className="bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-medium py-1 px-3 rounded-md transition duration-200 ease-in-out shadow-sm">
                                    Chọn
                                </button>
                            </div>
                        </div>

                        <div className="h-1 bg-gradient-to-r from-pink-400 to-orange-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    </div>
                ))}
            </div>

            {items.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-lg font-medium">Không tìm thấy sản phẩm</p>
                </div>
            )}
        </div>
    );
};

export default MenuList;