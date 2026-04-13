import request from '../utils/request.js';

export const createNotificationService = async ({ branch_id, order_id }) => {
    return await request.post('/notifications', { branch_id, order_id });
};

export const getNotificationsService = async ({ branch_id, status_admin } = {}) => {
    const params = {};
    if (branch_id) params.branch_id = branch_id;
    if (status_admin) params.status_admin = status_admin;
    return await request.get('/notifications', { params });
};

export const updateNotificationService = async (notificationId, status_admin) => {
    return await request.put(`/notifications/${notificationId}`, { status_admin });
};