import request from '../utils/request.js';

export const createOrderService = (payload) => {
    return request.post('/orders', payload);
};
export const getOrdersService = async ({ table_id, branch_id, status } = {}) => {
    const params = {};
    if (table_id) params.table_id = table_id;
    if (branch_id) params.branch_id = branch_id;
    if (status) params.status = status;
    return await request.get('/orders', { params });
};

export const getOrderDetailService = async (orderId) => {
    return await request.get(`/orders/${orderId}`);
};

export const updateOrderStatusService = async (orderId, status) => {
    return await request.put(`/orders/${orderId}`, { status });
};

export const deleteOrderService = async (orderId) => {
    return await request.delete(`/orders/${orderId}`);
};
