import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSearch,
    faShoppingCart,
    faBell,
    faUser,
} from '@fortawesome/free-solid-svg-icons';
import CategorySidebar from './CategorySidebar';
import MenuList from './MenuList';
import OrderPanel from './OrderPanel';
import ItemDetailModal from './ItemDetailModal';   // ✅ import modal mới
import useCategoryManagement from "../../pages/category/Usecategory/useCategory.js";
import { getBeverages } from "../../apiServices/beverageServices.js";

const Possystem = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedTable, setSelectedTable] = useState('Bàn 5');
    const [searchQuery, setSearchQuery] = useState('');
    const [cart, setCart] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);  // item đang xem modal
    const [menuItems, setMenuItems] = useState([]);
    const [loadingMenu, setLoadingMenu] = useState(false);

    const { data, loading, handleChangeBranch } = useCategoryManagement();

    const COLORS = [
        'from-red-400 to-orange-500',
        'from-amber-400 to-yellow-500',
        'from-green-400 to-emerald-500',
        'from-blue-400 to-cyan-500',
        'from-amber-600 to-amber-700',
        'from-orange-400 to-red-500',
        'from-pink-400 to-pink-500',
    ];

    const categories = [
        { id: null, name: 'Tất cả', image: null, color: 'from-pink-400 to-pink-500' },
        ...data.categories.map((cat, index) => ({
            id: cat.category_id,
            name: cat.category_name,
            image: cat.category_image,
            color: COLORS[index % COLORS.length],
        }))
    ];

    useEffect(() => {
        if (!data.selectedBranch) return;
        const fetchMenuItems = async () => {
            setLoadingMenu(true);
            try {
                const items = await getBeverages(selectedCategory, data.selectedBranch);
                setMenuItems(Array.isArray(items) ? items : []);
            } catch (error) {
                console.error('Error fetching menu items:', error);
                setMenuItems([]);
            } finally {
                setLoadingMenu(false);
            }
        };
        fetchMenuItems();
    }, [data.selectedBranch, selectedCategory]);

    const normalizedItems = menuItems.map(item => ({
        id: item.item_id,
        name: item.item_name,
        price: parseFloat(item.price),
        category: item.MenuCategory?.category_name,
        desc: item.item_description,
        image: item.item_image,
    }));

    const filteredItems = normalizedItems.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // ✅ Chỉ mở modal khi click card
    const handleSelectItem = (item) => {
        setSelectedItem(item);
    };

    // ✅ Thêm vào giỏ hàng (gọi từ modal sau khi chọn options)
    const addToCart = (itemWithOptions) => {
        setCart((prev) => {
            const existing = prev.find((c) => c.id === itemWithOptions.id);
            if (existing) {
                return prev.map((c) =>
                    c.id === itemWithOptions.id
                        ? { ...c, quantity: c.quantity + itemWithOptions.quantity }
                        : c
                );
            }
            return [...prev, itemWithOptions];
        });
    };

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity === 0) {
            setCart(cart.filter(item => item.id !== id));
        } else {
            setCart(cart.map(item =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            ));
        }
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(item => item.id !== id));
    };

    // ✅ Gửi đơn hàng
    const handleSubmitOrder = () => {
        console.log('Gửi đơn:', cart);
        // TODO: gọi API gửi đơn ở đây
        alert('Đơn hàng đã được gửi!');
        setCart([]);
    };

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Left Sidebar */}
            <CategorySidebar
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
            />

            {/* Middle Section */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-white shadow-sm px-6 py-4 border-b border-gray-100">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <select
                                value={data.selectedBranch}
                                onChange={(e) => handleChangeBranch(e.target.value)}
                                className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                            >
                                {loading.branches ? (
                                    <option>Đang tải...</option>
                                ) : (
                                    data.branches.map(branch => (
                                        <option key={branch.branch_id} value={branch.branch_id}>
                                            {branch.branch_name}
                                        </option>
                                    ))
                                )}
                            </select>

                            <select
                                value={selectedTable}
                                onChange={(e) => setSelectedTable(e.target.value)}
                                className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                            >
                                <option>Bàn 5</option>
                                <option>Bàn 1</option>
                                <option>Bàn 2</option>
                            </select>
                        </div>

                        <div className="relative flex-1 max-w-md">
                            <FontAwesomeIcon
                                icon={faSearch}
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
                            />
                            <input
                                type="text"
                                placeholder="Tìm kiếm..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="relative p-2.5 hover:bg-gray-100 rounded-lg transition-colors">
                                <FontAwesomeIcon icon={faBell} className="text-gray-600 text-lg" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>
                            {/*<button className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors">*/}
                            {/*    <FontAwesomeIcon icon={faShoppingCart} className="text-gray-600 text-lg" />*/}
                            {/*</button>*/}
                            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-orange-400 rounded-full flex items-center justify-center">
                                <FontAwesomeIcon icon={faUser} className="text-white text-sm" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Menu Items */}
                {loadingMenu ? (
                    <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                        Đang tải món...
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <div className="text-6xl mb-4">🔍</div>
                        <p className="text-lg font-medium">Không tìm thấy sản phẩm</p>
                    </div>
                ) : (
                    <MenuList
                        items={filteredItems}
                        onSelectItem={handleSelectItem}   // ✅ đổi prop
                        selectedItem={selectedItem}
                    />
                )}
            </div>

            {/* Right Panel */}
            <OrderPanel
                cart={cart}
                total={total}
                onUpdateQuantity={updateQuantity}
                onRemoveFromCart={removeFromCart}
                onSubmitOrder={handleSubmitOrder}  // ✅ thêm prop
            />

            {/* ✅ Modal hiển thị giữa màn hình */}
            {selectedItem && (
                <ItemDetailModal
                    item={selectedItem}
                    onClose={() => setSelectedItem(null)}
                    onAddToCart={addToCart}
                />
            )}
        </div>
    );
};

export default Possystem;