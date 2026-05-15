import request from "../utils/request.js";

// get data nhánh
export const getBranches = async () => {
    try {
        const res = await request.get('branches');
        console.log('lấy data chi nhánh  ok !');
        return res.data;
    } catch (error) {
        console.log(error);
    }
};
// thêm data nhánh
export const postBranches = async (data) => {
    try {
        const res = await request.post('/branches',data);
        console.log('thêm chi nhánh thành công rùi ');
        return res.data;

    } catch (error) {
        console.log('lôi khi thêm chi nhánh', error);
    }
}
// sửa data nhánh
export const updateBranch = async (id, data) => {
       console.log(id, data);
       const res = await request.put(`/branches/${id}`, data);
}
// xóa nhánh
export const deleteBranch = async (id) => {
    const res = await request.delete(`/branches/${id}`);
}