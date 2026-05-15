import request from "../utils/request";

export const getCategories = async (branchId) => {
    if (!branchId) return [];

    const response = await request.get(
        `/menu/categories?branch_id=${branchId}`
    );

    return response.data?.data || response.data || [];
};
