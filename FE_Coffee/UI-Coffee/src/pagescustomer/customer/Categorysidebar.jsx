import React from 'react';

const CategorySidebar = ({ categories, selectedCategory, onSelectCategory }) => {
    return (
        <>
            {/* ===== DESKTOP/TABLET SIDEBAR (md+) ===== */}
            <div className="hidden md:flex w-20 lg:w-28 bg-white shadow-lg flex-col items-center py-4 space-y-1 overflow-y-auto flex-shrink-0">
                <div className="mb-3 px-2 text-center">
                    <h1 className="text-[10px] lg:text-xs font-bold text-gray-800 tracking-wider leading-tight">
                        Khánh<br />Coffee
                    </h1>
                </div>

                {categories.map((category) => (
                    <button
                        key={category.id ?? 'all'}
                        onClick={() => onSelectCategory(category.id)}
                        className={`group relative w-14 lg:w-20 flex flex-col items-center justify-center p-2 lg:p-3 rounded-2xl transition-all duration-300 ${
                            selectedCategory === category.id
                                ? 'bg-gradient-to-br ' + category.color + ' shadow-lg scale-105'
                                : 'hover:bg-gray-50 hover:scale-105'
                        }`}
                    >
                        <div className={`mb-1 transition-transform duration-300 ${
                            selectedCategory === category.id ? 'scale-110' : 'group-hover:scale-110'
                        }`}>
                            {category.image ? (
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-7 h-7 lg:w-9 lg:h-9 object-cover rounded-full"
                                />
                            ) : (
                                <span className="text-xl lg:text-2xl">🌸</span>
                            )}
                        </div>
                        <span className={`text-[9px] lg:text-[11px] font-semibold text-center leading-tight transition-colors ${
                            selectedCategory === category.id
                                ? 'text-white'
                                : 'text-gray-600 group-hover:text-gray-900'
                        }`}>
                            {category.name}
                        </span>
                        {selectedCategory === category.id && (
                            <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-white rounded-l-full"></div>
                        )}
                    </button>
                ))}
            </div>

            {/* ===== MOBILE BOTTOM TAB BAR (< md) ===== */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-2xl">
                <div className="flex overflow-x-auto scrollbar-hide px-2 py-2 gap-1">
                    {categories.map((category) => (
                        <button
                            key={category.id ?? 'all'}
                            onClick={() => onSelectCategory(category.id)}
                            className={`flex-shrink-0 flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all duration-200 min-w-[60px] ${
                                selectedCategory === category.id
                                    ? 'bg-gradient-to-br ' + category.color + ' shadow-md scale-105'
                                    : 'hover:bg-gray-100'
                            }`}
                        >
                            {category.image ? (
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-6 h-6 object-cover rounded-full mb-0.5"
                                />
                            ) : (
                                <span className="text-lg mb-0.5">🌸</span>
                            )}
                            <span className={`text-[9px] font-semibold leading-tight text-center whitespace-nowrap ${
                                selectedCategory === category.id ? 'text-white' : 'text-gray-600'
                            }`}>
                                {category.name}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
};

export default CategorySidebar;