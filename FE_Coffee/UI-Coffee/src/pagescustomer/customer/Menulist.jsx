import React from 'react';

const MenuList = ({ items, onSelectItem, selectedItem }) => {
    return (
        <div className="h-full overflow-y-auto px-4 py-5">
            {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 py-20">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-lg font-medium">Không tìm thấy sản phẩm</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => onSelectItem(item)}
                            className={`group bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 border-2 flex flex-col ${
                                selectedItem?.id === item.id
                                    ? 'border-pink-400 shadow-md'
                                    : 'border-transparent hover:border-pink-100'
                            }`}
                        >
                            {/* ── Ảnh cố định tỉ lệ 1:1 ── */}
                            {/* Thêm max-w-[180px] hoặc max-w-[240px] và mx-auto để thu nhỏ ảnh lại */}
                            <div className="relative w-full max-w-[200px] mx-auto aspect-square overflow-hidden bg-gray-50 rounded-2xl border border-gray-100 flex-shrink-0 group">
                                {/* Ảnh sản phẩm */}
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                                    }}
                                />

                                {/* Fallback khi ảnh lỗi */}
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-orange-50/50 flex flex-col items-center justify-center gap-2 hidden text-gray-400">
                                    <span className="text-2xl filter grayscale opacity-70">☕</span>
                                    <span className="text-[10px] font-medium text-gray-400/80">No image</span>
                                </div>

                                {/* Badge giá (Thu nhỏ lại một chút để hợp với ảnh nhỏ) */}
                                <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-lg shadow-sm border border-white/40">
        <span className="text-xs font-semibold text-pink-600 tracking-tight whitespace-nowrap">
            {item.price.toLocaleString('vi-VN')} ₫
        </span>
                                </div>
                            </div>

                            {/* ── Thông tin ── */}
                            <div className="p-3 flex flex-col flex-1">
                                <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 leading-tight group-hover:text-pink-600 transition-colors mb-1">
                                    {item.name}
                                </h3>
                                {item.desc && (
                                    <p className="text-[11px] text-gray-400 line-clamp-1 mb-2 flex-1">
                                        {item.desc}
                                    </p>
                                )}
                                <button className="mt-auto w-full py-1.5 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-orange-400 text-gray-800 text-xs font-bold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-95">
                                    Chọn
                                </button>
                            </div>

                            {/* ── Bottom accent bar ── */}
                            <div className="h-0.5 bg-gradient-to-r from-pink-400 to-orange-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MenuList;