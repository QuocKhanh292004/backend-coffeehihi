import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser } from '@fortawesome/free-solid-svg-icons';
import CategorySidebar from './CategorySidebar';
import MenuList from './MenuList';
import OrderPanel from './OrderPanel';
import ItemDetailModal from './ItemDetailModal';
import Notification from '../../components/notification';
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
        if (branch_id) {
            handleChangeBranch(branch_id);
        }
        if (table_id) {
            setSelectedTable(Number(table_id));
        }
    }, [branch_id, table_id]);

    useEffect(() => {
        if (!data.selectedBranch) return;

        const fetchMenuItems = async () => {
            setLoadingMenu(true);
            try {
                const items = await getBeverages(selectedCategory, data.selectedBranch);
                setMenuItems(Array.isArray(items) ? items : []);
            } catch (error) {
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

            if (!table_id) {
                setSelectedTable(null);
            }
        };

        fetchTables();
    }, [data.selectedBranch]);

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

    const handleSelectItem = (item) => setSelectedItem(item);

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

    const removeFromCart = (id) =>
        setCart(cart.filter(item => item.id !== id));

    const handleSubmitOrder = () => {
        const branch = Number(data.selectedBranch);
        console.log("branch nhánh nè", branch);
        const table = Number(selectedTable);

        if (!branch || !table) {
            alert("Vui lòng chọn chi nhánh và bàn!");
            return;
        }

        navigate(`/customer/${branch}/${table}`);
        setCart([]);
    };

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <CategorySidebar
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-white shadow-sm px-6 py-4 border-b border-gray-100">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* Branch */}
                            <select
                                value={data.selectedBranch || ''}
                                onChange={(e) => handleChangeBranch(e.target.value)}
                                className="px-4 py-2.5 bg-gray-50 border rounded-lg text-sm"
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

                            {/* Table */}
                            <select
                                value={selectedTable || ''}
                                onChange={(e) => setSelectedTable(Number(e.target.value))}
                                className="px-4 py-2.5 bg-gray-50 border rounded-lg text-sm"
                            >
                                <option value="" disabled>-- Chọn bàn --</option>
                                {tables.map(table => (
                                    <option
                                        key={table.table_id}
                                        value={table.table_id}
                                        disabled={table.status !== "available"}
                                    >
                                        {table.table_name}
                                        {table.status !== "available" ? " (Có khách)" : ""}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                            />
                        </div>


                        <div className="flex items-center gap-3">
                            {console.log('nhánh chọn', data.selectedBranch, typeof data.selectedBranch)}
                            <CustomerNotification
                                branch_id={Number(data.selectedBranch) || null}
                                table_id={selectedTable}
                            />
                            <FontAwesomeIcon icon={faUser} />
                        </div>
                    </div>
                </div>

                {/* Menu */}
                {loadingMenu ? (
                    <div className="flex-1 flex items-center justify-center">Đang tải...</div>
                ) : (
                    <MenuList
                        items={filteredItems}
                        onSelectItem={handleSelectItem}
                        selectedItem={selectedItem}
                    />
                )}
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