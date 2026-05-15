import { useState, useEffect } from 'react';
import request from '../../../utils/request.js'

const useCategoryManagement = () => {
    // States
    const [data, setData] = useState({
        categories: [],
        branches: [],
        selectedBranch: '',
        searchTerm: ''
    });

    const [loading, setLoading] = useState({
        branches: false,
        categories: false
    });

    const [modal, setModal] = useState({
        isOpen: false,
        mode: 'add',
        selectedCategory: null
    });

    // API CALLS

    /**
     * Lấy danh sách chi nhánh
     */
    const getBranches = async () => {
        setLoading(prev => ({ ...prev, branches: true }));
        try {
            const response = await request.get('branches');
            const branches = response.data?.data || response.data || [];
            return branches;
        } catch (error) {
            console.error('Error getBranches:', error);
            return [];
        } finally {
            setLoading(prev => ({ ...prev, branches: false }));
        }
    };

    /**
     * Lấy danh sách categories theo branch_id
     */
    const getCategories = async (branchId) => {
        if (!branchId) {
            setData(prev => ({ ...prev, categories: [] }));
            return;
        }

        setLoading(prev => ({ ...prev, categories: true }));
        try {
            const response = await request.get(
                `/menu/categories?branch_id=${branchId}`
            );
            console.log('Full Response:', response);

            const categories = response.data?.data || response.data || [];
            console.log('Extracted Categories:', categories);

            setData(prev => ({ ...prev, categories }));
        } catch (error) {
            console.error('Error getCategories:', error);
            setData(prev => ({ ...prev, categories: [] }));
        } finally {
            setLoading(prev => ({ ...prev, categories: false }));
        }
    };

    /**
     * Lưu category (thêm mới hoặc cập nhật)
     */
    /**
     * Lưu category (thêm mới hoặc cập nhật)
     */
    const saveCategory = async (formData) => {
        console.log('Saving category (FormData):');

        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }

        try {
            const endpoint =
                modal.mode === 'add'
                    ? 'menu/categories'
                    : `menu/categories/${modal.selectedCategory.category_id}`;

            const method = modal.mode === 'add' ? 'post' : 'put';

            const response = await request[method](endpoint, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log('✅ Success:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Error:', error.response?.data || error.message);
            throw error;
        }
    };


    /**
     * Xóa category
     */
    const deleteCategory = async (id) => {
        await request.delete(`/menu/categories/${id}`);
    };

    // HANDLERS

    /**
     * Mở modal thêm mới
     */
    const handleOpenAdd = () => {
        if (!data.selectedBranch) {
            alert('Vui lòng chọn chi nhánh!');
            return;
        }
        setModal({ isOpen: true, mode: 'add', selectedCategory: null });
    };

    /**
     * Mở modal chỉnh sửa
     */
    const handleOpenEdit = (category) => {
        console.log('Opening edit for category:', category);
        setModal({ isOpen: true, mode: 'update', selectedCategory: category });
    };

    /**
     * Đóng modal
     */
    const handleCloseModal = () => {
        setModal({ isOpen: false, mode: 'add', selectedCategory: null });
    };

    /**
     * Lưu category
     */
    const handleSave = async (categoryData) => {
        try {
            await saveCategory(categoryData);
            await getCategories(data.selectedBranch);
            handleCloseModal();
        } catch (error) {
            console.error('Error save:', error);
            alert('Lỗi khi lưu danh mục');
        }
    };

    /**
     * Xóa category
     */
    const handleDelete = async (id) => {
        if (!window.confirm('Xóa danh mục này?')) return;

        try {
            await deleteCategory(id);
            await getCategories(data.selectedBranch);
        } catch (error) {
            console.error('Error delete:', error);
            alert('Lỗi khi xóa danh mục');
        }
    };

    /**
     * Thay đổi chi nhánh
     */
    const handleChangeBranch = (branchId) => {
        const numericBranchId = Number(branchId);
        console.log('Changing branch to:', numericBranchId);
        setData(prev => ({ ...prev, selectedBranch: numericBranchId }));
    };

    /**
     * Tìm kiếm
     */
    const handleSearch = (term) => {

        setData(prev => ({ ...prev, searchTerm: term }));
    };
    /**
     * Load branches khi component mount
     */
    useEffect(() => {
        (async () => {
            const branches = await getBranches();
            console.log('Loaded branches:', branches);
            setData(prev => ({
                ...prev,
                branches,
                selectedBranch: branches[0]?.branch_id || ''
            }));
        })();
    }, []);

    /**
     * Load categories khi branch thay đổi
     */
    useEffect(() => {
        if (data.selectedBranch) {
            console.log('Loading categories for branch:', data.selectedBranch);
            getCategories(data.selectedBranch);
        }
    }, [data.selectedBranch]);

    // COMPUTED VALUES

    /**
     * Lọc categories theo search term
     */
    const filteredCategories = data.categories.filter(cat =>
        cat.category_name?.toLowerCase().includes(data.searchTerm.toLowerCase().trim())
    );

    return {
        // Data
        data,
        loading,
        modal,
        filteredCategories,
        // Handlers
        handleOpenAdd,
        handleOpenEdit,
        handleCloseModal,
        handleSave,
        handleDelete,
        handleChangeBranch,
        handleSearch,
        // API functions (nếu cần sử dụng ở nơi khác)
        getBranches,
        getCategories
    };
};

export default useCategoryManagement;