import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser, faTimes } from '@fortawesome/free-solid-svg-icons';
import CategorySidebar from './CategorySidebar';
import MenuList from './MenuList';
import OrderPanel from './OrderPanel';
import ItemDetailModal from './ItemDetailModal';
import useCategoryManagement from "../../pages/category/Usecategory/useCategory.js";
import { getBeverages } from "../../apiServices/beverageServices.js";
import { getTables } from "../../apiServices/tablesServices.js";
import { useNavigate } from "react-router-dom";
import CustomerNotification from './CustomerNotification.jsx';

const Possystem = ({ branch_id, table_id }) => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedTable, setSelectedTable] = useState(null);
    const [tables, setTables] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cart, setCart] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [loadingMenu, setLoadingMenu] = useState(false);

    const navigate = useNavigate();
    const { data, loading, handleChangeBranch } = useCategoryManagement();

    const COLORS = [
        'from-red-400 to-orange-500',
        'from-amber-400 to-yellow-500',
        'from-green-400 to-emerald-500',
        'from-blue-400 to-cyan-500',
        'from-amber-600 to-amber-700',
        'from-orange-400 to-red-500',
        'from-pink-400 to-pink-500'
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
        if (branch_id) handleChangeBranch(branch_id);
        if (table_id) setSelectedTable(Number(table_id));
    }, [branch_id, table_id]);

    useEffect(() => {
        if (!data.selectedBranch) return;
        const fetchMenuItems = async () => {
            setLoadingMenu(true);
            try {
                const items = await getBeverages(selectedCategory, data.selectedBranch);
                setMenuItems(Array.isArray(items) ? items : []);
            } catch {
                setMenuItems([]);
            } finally {
                setLoadingMenu(false);
            }
        };
        fetchMenuItems();
    }, [data.selectedBranch, selectedCategory]);

    useEffect(() => {
        if (!data.selectedBranch) return;
        const fetchTables = async () => {
            const tablesData = await getTables(data.selectedBranch);
            setTables(tablesData);
            if (!table_id) setSelectedTable(null);
        };
        fetchTables();
    }, [data.selectedBranch]);

    const normalizedItems = menuItems.map(item => ({
        id: item.item_id,
        name: item.item_name,
        price: parseFloat(item.price),
        category_id: item.category_id,              // ← thêm dòng này
        category: item.MenuCategory?.category_name,
        desc: item.item_description,
        image: item.item_image,
    }));

    const filteredItems = normalizedItems.filter(item => {
        const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchCategory = selectedCategory == null || item.category_id === selectedCategory;
        return matchSearch && matchCategory;
    });

    // ─── Tạo cartKey duy nhất: cùng món nhưng khác note/ice/topping → entry riêng
    const makeCartKey = (item) => {
        const toppingKey = (item.toppings || []).map(t => t.id).sort().join(',');
        return `${item.id}__${item.iceOption || ''}__${item.note || ''}__${toppingKey}`;
    };

    const addToCart = (itemWithOptions) => {
        const cartKey = makeCartKey(itemWithOptions);
        setCart(prev => {
            const existing = prev.find(c => c._cartKey === cartKey);
            if (existing) {
                return prev.map(c =>
                    c._cartKey === cartKey
                        ? {
                            ...c,
                            quantity: c.quantity + itemWithOptions.quantity,
                            note: itemWithOptions.note || c.note,
                        }
                        : c
                );
            }
            return [...prev, { ...itemWithOptions, _cartKey: cartKey }];
        });
    };

    // updateQuantity và removeFromCart dùng _cartKey
    const updateQuantity = (cartKey, newQuantity) => {
        if (newQuantity === 0) {
            setCart(prev => prev.filter(item => item._cartKey !== cartKey));
        } else {
            setCart(prev => prev.map(item =>
                item._cartKey === cartKey ? { ...item, quantity: newQuantity } : item
            ));
        }
    };

    const removeFromCart = (cartKey) =>
        setCart(prev => prev.filter(item => item._cartKey !== cartKey));

    const handleSubmitOrder = () => {
        const branch = Number(data.selectedBranch);
        const table = Number(selectedTable);
        if (!branch || !table) { alert("Vui lòng chọn chi nhánh và bàn!"); return; }
        navigate(`/customer/${branch}/${table}`);
        setCart([]);
    };

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div className="flex h-[100dvh] bg-gray-50 overflow-hidden">

            <CategorySidebar
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
            />

            <div className="flex-1 flex flex-col overflow-hidden min-w-0">

                {/* ===== HEADER ===== */}
                <div className="bg-white shadow-sm px-3 sm:px-5 py-3 border-b border-gray-100 flex-shrink-0">

                    {/* Mobile header */}
                    <div className="flex items-center gap-2 md:hidden">
                        <select
                            value={data.selectedBranch || ''}
                            onChange={(e) => handleChangeBranch(e.target.value)}
                            className="flex-1 min-w-0 px-2 py-2 bg-gray-50 border rounded-lg text-xs truncate"
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
                            value={selectedTable || ''}
                            onChange={(e) => setSelectedTable(Number(e.target.value))}
                            className="flex-1 min-w-0 px-2 py-2 bg-gray-50 border rounded-lg text-xs truncate"
                        >
                            <option value="" disabled>-- Bàn --</option>
                            {tables.map(table => (
                                <option
                                    key={table.table_id}
                                    value={table.table_id}
                                    disabled={table.status !== "available"}
                                >
                                    {table.table_name}{table.status !== "available" ? " ✗" : ""}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={() => setShowSearch(v => !v)}
                            className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-lg flex-shrink-0"
                        >
                            <FontAwesomeIcon icon={showSearch ? faTimes : faSearch} className="text-gray-500 text-sm" />
                        </button>

                        <CustomerNotification
                            branch_id={Number(data.selectedBranch) || null}
                            table_id={selectedTable}
                        />
                        <FontAwesomeIcon icon={faUser} className="text-gray-500 flex-shrink-0" />
                    </div>

                    {showSearch && (
                        <div className="mt-2 md:hidden">
                            <input
                                type="text"
                                placeholder="Tìm kiếm món..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                                className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                            />
                        </div>
                    )}

                    {/* Tablet/Desktop header */}
                    <div className="hidden md:flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                        <div className="flex flex-col sm:flex-row gap-2">
                            <select
                                value={data.selectedBranch || ''}
                                onChange={(e) => handleChangeBranch(e.target.value)}
                                className="px-3 py-2 bg-gray-50 border rounded-lg text-sm"
                            >
                                {loading.branches ? (
                                    <option>Đang tải chi nhánh...</option>
                                ) : (
                                    data.branches.map(branch => (
                                        <option key={branch.branch_id} value={branch.branch_id}>
                                            {branch.branch_name}
                                        </option>
                                    ))
                                )}
                            </select>

                            <select
                                value={selectedTable || ''}
                                onChange={(e) => setSelectedTable(Number(e.target.value))}
                                className="px-3 py-2 bg-gray-50 border rounded-lg text-sm"
                            >
                                <option value="" disabled>-- Chọn bàn --</option>
                                {tables.map(table => (
                                    <option
                                        key={table.table_id}
                                        value={table.table_id}
                                        disabled={table.status !== "available"}
                                    >
                                        {table.table_name}{table.status !== "available" ? " (Có khách)" : ""}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="relative flex-1 max-w-md">
                            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <CustomerNotification
                                branch_id={Number(data.selectedBranch) || null}
                                table_id={selectedTable}
                            />
                            <FontAwesomeIcon icon={faUser} className="text-gray-600" />
                        </div>
                    </div>
                </div>

                {/* ===== MENU LIST ===== */}
                <div className="flex-1 overflow-hidden pb-16 md:pb-0">
                    {loadingMenu ? (
                        <div className="flex items-center justify-center h-full text-gray-500 text-sm">Đang tải...</div>
                    ) : (
                        <MenuList
                            items={filteredItems}
                            onSelectItem={(item) => setSelectedItem(item)}
                            selectedItem={selectedItem}
                        />
                    )}
                </div>
            </div>

            <OrderPanel
                cart={cart}
                total={total}
                onUpdateQuantity={updateQuantity}
                onRemoveFromCart={removeFromCart}
                onSubmitOrder={handleSubmitOrder}
                table_id={selectedTable}
                branch_id={data.selectedBranch}
            />

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