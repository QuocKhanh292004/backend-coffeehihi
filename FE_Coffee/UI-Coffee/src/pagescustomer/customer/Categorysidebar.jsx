import React from 'react';

const CategorySidebar = ({ categories, selectedCategory, onSelectCategory }) => {
    return (
        <div className="w-20 lg:w-28 bg-white shadow-lg flex flex-col items-center py-6 space-y-2 overflow-y-auto">
            <div className="mb-4">
                <h1 className="text-xs lg:text-sm font-bold text-gray-800 tracking-wider">Khánh coffe</h1>
            </div>

            {categories.map((category) => (
                <button
                    key={category.id ?? 'all'}
                    onClick={() => onSelectCategory(category.id)}
                    className={`group relative w-16 lg:w-20 flex flex-col items-center justify-center p-3 lg:p-4 rounded-2xl transition-all duration-300 ${
                        selectedCategory === category.id
                            ? 'bg-gradient-to-br ' + category.color + ' shadow-lg scale-105'
                            : 'hover:bg-gray-50 hover:scale-105'
                    }`}
                >

                    <div className={`mb-1.5 transition-transform duration-300 ${
                        selectedCategory === category.id ? 'scale-110' : 'group-hover:scale-110'
                    }`}>
                        {category.image ? (
                            <img
                                src={category.image}
                                alt={category.name}
                                className="w-8 h-8 lg:w-10 lg:h-10 object-cover rounded-full"
                            />
                        ) : (
                            <span className="text-2xl lg:text-3xl">🌸</span>
                        )}
                    </div>

                    {/* Label */}
                    <span className={`text-[10px] lg:text-xs font-semibold text-center leading-tight transition-colors ${
                        selectedCategory === category.id
                            ? 'text-white'
                            : 'text-gray-600 group-hover:text-gray-900'
                    }`}>
                        {category.name}
                    </span>

                    {/* Active indicator */}
                    {selectedCategory === category.id && (
                        <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-l-full"></div>
                    )}
                </button>
            ))}
        </div>
    );
};

export default CategorySidebar;