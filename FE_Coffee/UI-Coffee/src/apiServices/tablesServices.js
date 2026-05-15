import request from "../utils/request.js";

// Lấy danh sách bàn (branch_id là bắt buộc)
export const getTables = async (branch_id) => {
    try {
        const res = await request.get(`tables?branch_id=${branch_id}`);
        console.log('Lấy danh sách bàn ok!', res.data);
        // API trả về { tables: [...], total, page, limit }
        return res.data?.tables ?? [];
    } catch (error) {
        console.log('Lỗi khi lấy danh sách bàn', error);
        return [];
    }
};

// Thêm bàn mới
// body: { table_name, branch_id, capacity, status }
export const createTable = async (data) => {
    try {
        const res = await request.post('/tables', data);
        console.log('Thêm bàn thành công!');
        return res.data;
    } catch (error) {
        console.log('Lỗi khi thêm bàn', error);
    }
};

// Sửa bàn
// body: { table_name, branch_id, capacity, status }
export const updateTable = async (id, data) => {
    try {
        const res = await request.put(`/tables/${id}`, data);
        console.log('Cập nhật bàn thành công!');
        return res.data;
    } catch (error) {
        console.log('Lỗi khi cập nhật bàn', error);
    }
};

// Xóa bàn
export const deleteTable = async (id) => {
    try {
        const res = await request.delete(`/tables/${id}`);
        console.log('Xóa bàn thành công!');
        return res.data;
    } catch (error) {
        console.log('Lỗi khi xóa bàn', error);
    }
};