import request from "../utils/request";

// Lấy danh sách đồ uống theo category và branch
export const getMenuItems = async (categoryId, branchId) => {
    try {
        const response = await request.get('/menu/items', {
            params: {
                category_id: categoryId,
                branch_id: branchId
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching menu items:', error);
        throw error;
    }
};

// ✅ Hàm dùng chung để build FormData cho cả create và update
const buildFormData = (menuData) => {
    const formData = new FormData();
    formData.append('item_name', menuData.item_name);
    formData.append('price', menuData.price);
    formData.append('item_description', menuData.item_description || '');
    formData.append('category_id', menuData.category_id);
    formData.append('branch_id', menuData.branch_id);
    formData.append('is_disable', menuData.is_disable);

    // ✅ Nếu user chọn ảnh mới → gửi File object (multipart)
    // Nếu không chọn ảnh mới (edit) → không gửi field image, server giữ ảnh cũ
    // ✅ Server dùng singleImageUpload với field name là 'image' (xem swagger/route)
    if (menuData.imageFile instanceof File) {
        formData.append('image', menuData.imageFile);
    }

    return formData;
};

// Thêm đồ uống mới
export const createMenuItem = async (menuData) => {
    try {
        const formData = buildFormData(menuData);

        const response = await request.post('/menu/items', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating menu item:', error);
        throw error;
    }
};

// Cập nhật đồ uống
export const updateMenuItem = async (id, menuData) => {
    try {
        const formData = buildFormData(menuData);

        const response = await request.put(`/menu/items/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating menu item:', error);
        throw error;
    }
};

// Xóa đồ uống
export const deleteMenuItem = async (id) => {
    try {
        const response = await request.delete(`/menu/items/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting menu item:', error);
        throw error;
    }
};