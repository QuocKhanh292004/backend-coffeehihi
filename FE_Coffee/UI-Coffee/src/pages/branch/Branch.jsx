import React, {useEffect, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faEdit, faTrashAlt, faPlus, faAngleLeft, faAngleRight, faAngleDoubleLeft, faAngleDoubleRight
} from '@fortawesome/free-solid-svg-icons';
import usePagination from '../../hook/usePagination.js';
import BranchModal from './BranchModal.jsx';
import * as branchesServices from '../../apiServices/branchesServices.js';

function Branch() {

     const [allBranches, setAllBranches] = useState([]);
     const fetchApi = async () => {
          try {
               const res = await branchesServices.getBranches('branches');

               const mappedBranches = res.map((item) => ({
                    id: item.branch_id,
                    name: item.branch_name,
                    description: item.description,
                    rid: item.rid,
                    isDelete: item.is_delete,
               }));

               setAllBranches(mappedBranches);
          } catch (error) {
               console.log('Lỗi khi lấy danh sách chi nhánh', error);
          }
     };
     useEffect(() => {
          fetchApi();
     }, []);
     const handleDeleteBranch = async (branchId) => {
          const confirmDelete = window.confirm('Bạn có chắc chắn muốn xoá chi nhánh này không?');

          if (!confirmDelete) return;

          try {
               await branchesServices.deleteBranch(branchId);
               fetchApi(); // 🔥 load lại danh sách sau khi xoá
          } catch (error) {
               console.log('Lỗi khi xoá chi nhánh:', error);
          }
     };

     const [itemsPerPage, setItemsPerPage] = useState(5);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [selectedBranch, setSelectedBranch] = useState(null);

    const {
        currentPage, totalPages, totalItems, startItem, endItem, currentData, goToPage,
    } = usePagination(allBranches, itemsPerPage);

    const handleOpenAdd = () => {
        setModalMode('add');
        setSelectedBranch(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (branch) => {
        setModalMode('update');
        setSelectedBranch(branch);
        setIsModalOpen(true);
    };

    return (<div className="max-w-7xl mx-auto p-4 md:p-8 bg-white min-h-screen text-slate-700 font-sans">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-slate-800">Quản lý chi nhánh</h2>
                <button
                    onClick={handleOpenAdd}
                    className="flex items-center gap-2 bg-[#1e293b] hover:bg-slate-900 text-white px-4 py-2 rounded-lg shadow-sm transition-all text-sm font-semibold active:scale-95"
                >
                    <FontAwesomeIcon icon={faPlus} className="text-xs"/>
                    Thêm Mới
                </button>
            </div>

            <div className="border border-slate-100 rounded-xl shadow-sm overflow-hidden bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[600px]">
                        <thead>
                        <tr className="bg-slate-50 text-slate-600 text-[11px] uppercase tracking-widest font-black">
                            <th className="py-4 px-6 text-left w-1/3">Tên chi nhánh</th>
                            <th className="py-4 px-6 text-left border-x border-slate-100">Mô tả</th>
                            <th className="py-4 px-6 text-center w-32">Thao tác</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-sm">
                        {currentData.map((branch) => (
                            <tr key={branch.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-4 px-6 text-slate-700 font-medium">{branch.name}</td>
                                <td className="py-4 px-6 border-x border-slate-50 text-slate-500 italic">{branch.description}</td>
                                <td className="py-4 px-6">
                                    <div className="flex justify-center gap-4">
                                        <button onClick={() => handleOpenEdit(branch)}
                                                className="text-slate-600 hover:text-slate-900"><FontAwesomeIcon
                                            icon={faEdit}/></button>
                                         <button
                                             onClick={() => handleDeleteBranch(branch.id)}
                                             className="text-slate-300 hover:text-red-500"
                                         >
                                              <FontAwesomeIcon icon={faTrashAlt}/>
                                         </button>

                                    </div>
                                </td>
                            </tr>))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div
                    className="px-6 py-4 bg-white border-t border-slate-100 flex flex-col md:flex-row justify-end items-center gap-6 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <div className="flex items-center gap-2">
                        <span>Tổng số trên 1 trang:</span>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => {
                                setItemsPerPage(Number(e.target.value));
                                goToPage(1); // Reset về trang 1 khi đổi số lượng hiển thị
                            }}
                            className="bg-transparent border-none focus:ring-0 cursor-pointer text-slate-600 outline-none"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-4">
                        <span
                            className="text-slate-300">Hiển thị từ {startItem} - {endItem} trên tổng số {totalItems}</span>
                        <div className="flex items-center gap-1">
                            <button onClick={() => goToPage(1)} disabled={currentPage === 1}
                                    className="p-2 disabled:opacity-20"><FontAwesomeIcon icon={faAngleDoubleLeft}/>
                            </button>
                            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}
                                    className="p-2 disabled:opacity-20"><FontAwesomeIcon icon={faAngleLeft}/></button>
                            <span
                                className="bg-[#1e293b] text-white w-7 h-7 flex items-center justify-center rounded-full shadow-md">{currentPage}</span>
                            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}
                                    className="p-2 disabled:opacity-20"><FontAwesomeIcon icon={faAngleRight}/></button>
                            <button onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages}
                                    className="p-2 disabled:opacity-20"><FontAwesomeIcon icon={faAngleDoubleRight}/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
         <BranchModal
             isOpen={isModalOpen}
             onClose={() => setIsModalOpen(false)}
             mode={modalMode}
             initialData={selectedBranch}
             onRefresh={fetchApi}
         />
        </div>);
}

export default Branch;