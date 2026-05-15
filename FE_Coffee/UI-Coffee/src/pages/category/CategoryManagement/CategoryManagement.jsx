import React, { useState, useEffect } from 'react';
import { faStore } from '@fortawesome/free-solid-svg-icons';
import {CategoryHeader} from "../Categorycomponents/CategoryHeader.jsx";
import {CategoryFilters} from "../Categorycomponents/CategoryFilters.jsx";
import {LoadingSpinner} from "../Categorycomponents/LoadingSpinner.jsx";
import {EmptyState} from "../Categorycomponents/EmptyState.jsx";
import {CategoryTable} from "../Categorycomponents/ CategoryTable.jsx";
import Pagination from "../../order/Pagination.jsx";
import CategoryModal from "../CategoryModal.jsx";
import useCategoryManagement from "../Usecategory/useCategory.js";
import usePagination from "../../../hook/usePagination.js";


const CategoryManagement = () => {
    // Custom hook cho logic và API
    const {
        data,
        loading,
        modal,
        filteredCategories,
        handleOpenAdd,
        handleOpenEdit,
        handleCloseModal,
        handleSave,
        handleDelete,
        handleChangeBranch,
        handleSearch,
    } = useCategoryManagement();

    // State cho pagination
    const [itemsPerPage, setItemsPerPage] = useState(5);

    // Pagination hook
    const {
        currentPage,
        totalPages,
        totalItems,
        startItem,
        endItem,
        currentData,
        goToPage
    } = usePagination(filteredCategories, itemsPerPage);

    // Debug effect
    // useEffect(() => {
    //     console.log('Filtered categories:', filteredCategories);
    //     console.log('Current page data:', currentData);
    // }, [filteredCategories, currentData]);

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 bg-gradient-to-br from-slate-50 to-white min-h-screen">
            {/* Header */}
            <CategoryHeader
                totalItems={totalItems}
                loading={loading.categories}
                onAddClick={handleOpenAdd}
                disabled={!data.selectedBranch}
            />

            {/* Filters */}
            <CategoryFilters
                branches={data.branches}
                selectedBranch={data.selectedBranch}
                searchTerm={data.searchTerm}
                loadingBranches={loading.branches}
                onBranchChange={handleChangeBranch}
                onSearch={handleSearch}
            />

            {/* Table Container */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
                {loading.categories ? (
                    // Loading state
                    <LoadingSpinner />
                ) : !data.selectedBranch ? (
                    // No branch selected
                    <EmptyState icon={faStore} title="Vui lòng chọn chi nhánh" />
                ) : currentData.length === 0 ? (
                    // No data
                    <EmptyState
                        icon="📦"
                        title="Không tìm thấy danh mục"
                        subtitle={
                            data.searchTerm
                                ? `Không có kết quả cho "${data.searchTerm}"`
                                : 'Chưa có danh mục nào'
                        }
                    />
                ) : (
                    // Has data
                    <>
                        <CategoryTable
                            categories={currentData}
                            onEdit={handleOpenEdit}
                            onDelete={handleDelete}
                        />

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={totalItems}
                            startItem={startItem}
                            endItem={endItem}
                            itemsPerPage={itemsPerPage}
                            onPageChange={goToPage}
                            onItemsPerPageChange={setItemsPerPage}
                        />
                    </>
                )}
            </div>

            {/* Modal */}
            <CategoryModal
                isOpen={modal.isOpen}
                onClose={handleCloseModal}
                mode={modal.mode}
                initialData={modal.selectedCategory}
                onSave={handleSave}
                branches={data.branches}
                selectedBranch={data.selectedBranch}
            />
        </div>
    );
};

export default CategoryManagement;