import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
     faEdit,
     faTrashAlt,
     faSearch,
     faPlus,
     faAngleLeft,
     faAngleRight,
     faAngleDoubleLeft,
     faAngleDoubleRight
} from '@fortawesome/free-solid-svg-icons';
import BeverageModal from "./BeverageModal.jsx";
import useCategoryManagement from "../category/Usecategory/useCategory.js";
import { getBranches } from '../../apiServices/branchesServices.js';
import { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from '../../apiServices/menuServices.js';

const Beverage = () => {
     const [allBeverages, setAllBeverages] = useState([]);
     const [branches, setBranches] = useState([]);
     const [isModalOpen, setIsModalOpen] = useState(false);
     const [modalMode, setModalMode] = useState('add');
     const [selectedBeverage, setSelectedBeverage] = useState(null);
     const [itemsPerPage, setItemsPerPage] = useState(5);
     const [currentPage, setCurrentPage] = useState(1);
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState(null);

     const [filters, setFilters] = useState({
          name: '',
          categoryId: '',
          branchId: ''
     });

     const { data } = useCategoryManagement();
     const [categories, setCategories] = useState([]);

     useEffect(() => {
          if (!data) return;
          const rawCategories = data.categories;
          if (!rawCategories || !Array.isArray(rawCategories)) {
               setCategories([]);
               return;
          }
          const processedCategories = rawCategories.map(cat => ({
               id: cat.category_id || cat.id,
               name: cat.category_name || cat.name,
               description: cat.description,
               image: cat.category_image,
               branchId: cat.branch_id
          }));
          setCategories(processedCategories);
     }, [data]);

     useEffect(() => {
          const fetchBranches = async () => {
               try {
                    setError(null);
                    const response = await getBranches();
                    let branchData = null;
                    if (response?.data && Array.isArray(response.data)) {
                         branchData = response.data;
                    } else if (Array.isArray(response)) {
                         branchData = response;
                    }
                    if (!branchData || branchData.length === 0) {
                         setBranches([]);
                         return;
                    }
                    const mappedBranches = branchData.map(branch => ({
                         id: branch.branch_id,
                         name: branch.branch_name,
                         rid: branch.rid,
                         description: branch.description,
                         image: branch.branch_image,
                         is_delete: branch.is_delete
                    }));
                    setBranches(mappedBranches.filter(b => !b.is_delete));
               } catch (error) {
                    console.error('❌ Error loading branches:', error);
                    setError('Không thể tải danh sách chi nhánh: ' + error.message);
                    setBranches([]);
               }
          };
          fetchBranches();
     }, []);

     const fetchMenuItems = useCallback(async () => {
          if (!filters.categoryId || !filters.branchId) return;
          setLoading(true);
          setError(null);
          try {
               const response = await getMenuItems(filters.categoryId, filters.branchId);
               let menuData = null;
               if (response?.data && Array.isArray(response.data)) {
                    menuData = response.data;
               } else if (Array.isArray(response)) {
                    menuData = response;
               }
               const mappedItems = (menuData || []).map(item => ({
                    id: item.item_id,
                    rid: item.rid,
                    name: item.item_name,
                    description: item.item_description,
                    image: item.item_image,
                    price: parseFloat(item.price) || 0,
                    category_id: item.category_id,
                    branch_id: item.branch_id,
                    isOutOfStock: item.is_disable,
                    is_delete: item.is_delete,
                    categoryName: item.MenuCategory?.category_name,
                    branchName: item.Branch?.branch_name
               }));
               setAllBeverages(mappedItems);
          } catch (error) {
               console.error('❌ Error loading menu items:', error);
               setError('Không thể tải danh sách đồ uống: ' + error.message);
               setAllBeverages([]);
          } finally {
               setLoading(false);
          }
     }, [filters.categoryId, filters.branchId]);

     useEffect(() => {
          if (filters.categoryId && filters.branchId) {
               fetchMenuItems();
          } else {
               setAllBeverages([]);
          }
     }, [filters.categoryId, filters.branchId, fetchMenuItems]);

     const filteredBeverages = allBeverages.filter(item => {
          if (filters.name) {
               return item.name?.toLowerCase().includes(filters.name.toLowerCase());
          }
          return true;
     });

     const totalItems = filteredBeverages.length;
     const totalPages = Math.ceil(totalItems / itemsPerPage);
     const startIndex = (currentPage - 1) * itemsPerPage;
     const endIndex = startIndex + itemsPerPage;
     const currentData = filteredBeverages.slice(startIndex, endIndex);
     const startItem = totalItems > 0 ? startIndex + 1 : 0;
     const endItem = Math.min(endIndex, totalItems);

     const goToPage = (page) => {
          if (page >= 1 && page <= totalPages) setCurrentPage(page);
     };

     const handleOpenAdd = () => {
          setModalMode('add');
          setSelectedBeverage(null);
          setIsModalOpen(true);
     };

     const handleOpenEdit = (item) => {
          setModalMode('update');
          setSelectedBeverage(item);
          setIsModalOpen(true);
     };

     const handleSaveBeverage = async (formData) => {
          try {
               setError(null);

               // ✅ Truyền imageFile (File object thật) để menuServices gửi multipart/form-data
               const menuData = {
                    item_name: formData.name,
                    price: parseFloat(formData.price) || 0,
                    item_description: formData.description || '',
                    category_id: parseInt(formData.category) || 1,
                    branch_id: parseInt(formData.branch) || 0,
                    is_disable: formData.isOutOfStock || false,
                    imageFile: formData.imageFile || null   // ✅ File object, không phải base64
               };

               if (modalMode === 'add') {
                    await createMenuItem(menuData);
                    alert('Thêm đồ uống thành công!');
               } else {
                    await updateMenuItem(selectedBeverage.id, menuData);
                    alert('Cập nhật đồ uống thành công!');
               }

               await fetchMenuItems();
               setIsModalOpen(false);
          } catch (error) {
               console.error('❌ Error saving beverage:', error);
               alert('Có lỗi xảy ra: ' + error.message);
          }
     };

     const handleDeleteBeverage = async (id) => {
          if (window.confirm('Bạn có chắc chắn muốn xóa đồ uống này?')) {
               try {
                    setError(null);
                    await deleteMenuItem(id);
                    alert('Xóa đồ uống thành công!');
                    await fetchMenuItems();
               } catch (error) {
                    console.error('❌ Error deleting beverage:', error);
                    alert('Có lỗi xảy ra: ' + error.message);
               }
          }
     };

     const handleSearch = () => {
          setCurrentPage(1);
          if (filters.categoryId && filters.branchId) fetchMenuItems();
     };

     const handleFilterChange = (field, value) => {
          setFilters(prev => ({ ...prev, [field]: value }));
          if (field !== 'name') setCurrentPage(1);
     };

     return (
         <div className="max-w-7xl mx-auto p-4 md:p-8 bg-white min-h-screen text-slate-700 font-sans">
              {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                       <strong>Lỗi:</strong> {error}
                  </div>
              )}

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                   <h2 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">Quản lý đồ uống</h2>
                   <button
                       onClick={handleOpenAdd}
                       className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-5 py-2 rounded-lg shadow-sm transition-all duration-200 font-semibold text-sm active:scale-95"
                   >
                        <FontAwesomeIcon icon={faPlus} className="text-xs" />
                        Thêm Mới
                   </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                   <input
                       type="text"
                       placeholder="Tên đồ uống"
                       value={filters.name}
                       onChange={(e) => handleFilterChange('name', e.target.value)}
                       className="w-full px-4 h-11 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-10 focus:border-slate-400 transition-all duration-200 bg-white text-sm"
                   />
                   <select
                       value={filters.categoryId}
                       onChange={(e) => handleFilterChange('categoryId', e.target.value)}
                       className="w-full px-4 h-11 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-10 bg-white text-slate-600 text-sm cursor-pointer"
                   >
                        <option value="">Chọn danh mục ({categories.length})</option>
                        {categories.map((cat, index) => (
                            <option key={`cat-${cat.id}-${index}`} value={cat.id}>{cat.name}</option>
                        ))}
                   </select>
                   <select
                       value={filters.branchId}
                       onChange={(e) => handleFilterChange('branchId', e.target.value)}
                       className="w-full px-4 h-11 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-10 bg-white text-slate-600 text-sm cursor-pointer"
                   >
                        <option value="">Chọn chi nhánh ({branches.length})</option>
                        {branches.map((branch, index) => (
                            <option key={`branch-${branch.id}-${index}`} value={branch.id}>{branch.name}</option>
                        ))}
                   </select>
                   <button
                       onClick={handleSearch}
                       className="bg-slate-800 hover:bg-slate-700 text-white px-6 h-11 rounded-lg transition-all duration-200 font-bold text-sm shadow-sm flex items-center justify-center gap-2"
                   >
                        <FontAwesomeIcon icon={faSearch} />
                        Tìm Kiếm
                   </button>
              </div>

              {loading && (
                  <div className="text-center py-8">
                       <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
                       <p className="text-slate-500 mt-2">Đang tải dữ liệu...</p>
                  </div>
              )}

              {!loading && (!filters.categoryId || !filters.branchId) && (
                  <div className="text-center py-12 bg-slate-50 rounded-xl">
                       <p className="text-slate-500">Vui lòng chọn danh mục và chi nhánh để xem đồ uống</p>
                  </div>
              )}

              {!loading && filters.categoryId && filters.branchId && (
                  <div className="border border-slate-100 rounded-xl shadow-sm bg-white overflow-hidden">
                       <div className="overflow-x-auto">
                            <table className="w-full border-collapse min-w-[1000px]">
                                 <thead>
                                 <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-widest font-black">
                                      <th className="py-4 px-4 text-center">Hình ảnh</th>
                                      <th className="py-4 px-4 text-left border-x border-slate-100">Tên đồ uống</th>
                                      <th className="py-4 px-4 text-left border-r border-slate-100">Tên danh mục</th>
                                      <th className="py-4 px-4 text-left border-r border-slate-100">Chi nhánh</th>
                                      <th className="py-4 px-4 text-left border-r border-slate-100">Mô tả</th>
                                      <th className="py-4 px-4 text-center border-r border-slate-100">Giá tiền</th>
                                      <th className="py-4 px-4 text-center border-r border-slate-100">Hết món</th>
                                      <th className="py-4 px-4 text-center">Thao tác</th>
                                 </tr>
                                 </thead>
                                 <tbody className="divide-y divide-slate-50 text-sm">
                                 {currentData.length === 0 ? (
                                     <tr>
                                          <td colSpan="8" className="py-12 text-center text-slate-400">
                                               Không có dữ liệu
                                          </td>
                                     </tr>
                                 ) : (
                                     currentData.map((item, index) => (
                                         <tr key={`beverage-${item.id}-${index}`} className="hover:bg-slate-50 hover:bg-opacity-50 transition-colors duration-150">
                                              <td className="py-3 px-4">
                                                   <div className="flex justify-center">
                                                        <img
                                                            src={item.image || 'https://via.placeholder.com/50'}
                                                            alt={item.name || 'Beverage'}
                                                            className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100 shadow-sm"
                                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/50'; }}
                                                        />
                                                   </div>
                                              </td>
                                              <td className="py-3 px-4 border-x border-slate-50 text-slate-700 font-semibold">
                                                   {item.name || 'N/A'}
                                              </td>
                                              <td className="py-3 px-4 border-r border-slate-50 text-slate-500">
                                                   {item.categoryName || categories.find(c => c.id === item.category_id)?.name || 'N/A'}
                                              </td>
                                              <td className="py-3 px-4 border-r border-slate-50 text-slate-500">
                                                   {item.branchName || branches.find(b => b.id === item.branch_id)?.name || 'N/A'}
                                              </td>
                                              <td className="py-3 px-4 border-r border-slate-50 text-slate-500 italic max-w-xs truncate">
                                                   {item.description || '-'}
                                              </td>
                                              <td className="py-3 px-4 border-r border-slate-50 text-center font-bold text-slate-600">
                                                   {(item.price || 0).toLocaleString('vi-VN')} ₫
                                              </td>
                                              <td className="py-3 px-4 border-r border-slate-50 text-center">
                                                   <input
                                                       type="checkbox"
                                                       checked={item.isOutOfStock || false}
                                                       className="w-4 h-4 rounded border-slate-300 text-slate-800 focus:ring-2 focus:ring-slate-500 cursor-pointer"
                                                       readOnly
                                                   />
                                              </td>
                                              <td className="py-3 px-4">
                                                   <div className="flex justify-center gap-4">
                                                        <button
                                                            onClick={() => handleOpenEdit(item)}
                                                            className="text-slate-600 hover:text-slate-900 transition-colors duration-200"
                                                            title="Sửa"
                                                        >
                                                             <FontAwesomeIcon icon={faEdit} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteBeverage(item.id)}
                                                            className="text-slate-400 hover:text-red-500 transition-colors duration-200"
                                                            title="Xóa"
                                                        >
                                                             <FontAwesomeIcon icon={faTrashAlt} />
                                                        </button>
                                                   </div>
                                              </td>
                                         </tr>
                                     ))
                                 )}
                                 </tbody>
                            </table>
                       </div>

                       {currentData.length > 0 && (
                           <div className="px-6 py-4 bg-white border-t border-slate-100 flex flex-col md:flex-row justify-end items-center gap-6">
                                <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                                     <span>Tổng số trên 1 trang:</span>
                                     <select
                                         value={itemsPerPage}
                                         onChange={(e) => {
                                              setItemsPerPage(Number(e.target.value));
                                              setCurrentPage(1);
                                         }}
                                         className="bg-transparent border-none focus:ring-0 cursor-pointer text-slate-600 text-sm outline-none"
                                     >
                                          <option value={5}>5</option>
                                          <option value={10}>10</option>
                                          <option value={20}>20</option>
                                     </select>
                                </div>
                                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider">
                                     <span className="text-slate-300">
                                         Hiển thị từ {startItem} - {endItem} trên tổng số {totalItems}
                                     </span>
                                     <div className="flex items-center gap-1">
                                          <button onClick={() => goToPage(1)} disabled={currentPage === 1} className="p-2 text-slate-300 hover:text-slate-600 disabled:opacity-20 transition-colors duration-200">
                                               <FontAwesomeIcon icon={faAngleDoubleLeft} />
                                          </button>
                                          <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="p-2 text-slate-300 hover:text-slate-600 disabled:opacity-20 transition-colors duration-200">
                                               <FontAwesomeIcon icon={faAngleLeft} />
                                          </button>
                                          <div className="flex gap-1 mx-2">
                                               {totalPages > 0 && [...Array(totalPages)].map((_, index) => (
                                                   <button
                                                       key={`page-${index}`}
                                                       onClick={() => goToPage(index + 1)}
                                                       className={`w-8 h-8 flex items-center justify-center rounded-full font-bold transition-all duration-200 ${
                                                           currentPage === index + 1 ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-100'
                                                       }`}
                                                   >
                                                        {index + 1}
                                                   </button>
                                               ))}
                                          </div>
                                          <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 text-slate-300 hover:text-slate-600 disabled:opacity-20 transition-colors duration-200">
                                               <FontAwesomeIcon icon={faAngleRight} />
                                          </button>
                                          <button onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages} className="p-2 text-slate-300 hover:text-slate-600 disabled:opacity-20 transition-colors duration-200">
                                               <FontAwesomeIcon icon={faAngleDoubleRight} />
                                          </button>
                                     </div>
                                </div>
                           </div>
                       )}
                  </div>
              )}

              {isModalOpen && (
                  <BeverageModal
                      isOpen={isModalOpen}
                      onClose={() => setIsModalOpen(false)}
                      mode={modalMode}
                      initialData={selectedBeverage}
                      onSave={handleSaveBeverage}
                      categories={categories}
                      branches={branches}
                  />
              )}
         </div>
     );
};

export default Beverage;