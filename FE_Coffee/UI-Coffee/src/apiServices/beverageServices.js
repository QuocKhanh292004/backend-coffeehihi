import request from "../utils/request.js";

export const getBeverages = async (categoryId = null, branchId = null) => {
    try {
        const params = new URLSearchParams();
        if (categoryId) params.append('category_id', categoryId);
        if (branchId) params.append('branch_id', branchId);

        const url = params.toString() ? `/menu/items?${params.toString()}` : '/menu/items';
        const response = await request.get(url);

        // response.data = { success, message, data: [...] }
        return response.data?.data ?? response.data ?? [];
    } catch (error) {
        console.error('Error fetching beverages:', error);
        throw error;
    }
};

export const createBeverage = async (beverageData) => {
    try {
        const response = await request.post('/menu/items', beverageData);
        return response.data;
    } catch (error) {
        console.error('Error creating beverage:', error);
        throw error;
    }
};

export const updateBeverage = async (id, beverageData) => {
    try {
        const response = await request.put(`/menu/items/${id}`, beverageData);
        return response.data;
    } catch (error) {
        console.error('Error updating beverage:', error);
        throw error;
    }
};

export const deleteBeverage = async (id) => {
    try {
        const response = await request.delete(`/menu/items/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting beverage:', error);
        throw error;
    }
};

export const getBeverageById = async (id) => {
    try {
        const response = await request.get(`/menu/items/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching beverage by id:', error);
        throw error;
    }
};

export const updateBeverageStock = async (id, outOfStock) => {
    try {
        const response = await request.patch(`/menu/items/${id}`, { outOfStock });
        return response.data;
    } catch (error) {
        console.error('Error updating beverage stock:', error);
        throw error;
    }
};