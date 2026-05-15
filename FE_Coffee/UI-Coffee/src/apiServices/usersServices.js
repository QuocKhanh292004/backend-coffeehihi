import request from "../utils/request";

// Lấy toàn bộ người dùng — GET /users
export const getAllUsers = async () => {
    try {
        const res = await request.get('/users');
        console.log('Lấy tất cả user OK');
        // Xử lý cả 2 dạng response: { data: { users } } hoặc mảng trực tiếp
        return res.data?.data?.users || res.data?.users || res.data || [];
    } catch (error) {
        console.log(error, 'Lỗi khi lấy danh sách user');
        throw error;
    }
};

// Lấy danh sách người dùng theo chi nhánh — GET /users/branch/users?branch_id=
export const branchUsers = async (branchId) => {
    try {
        const res = await request.get(`/users/branch/users?branch_id=${branchId}`);
        console.log('Lấy data theo nhánh OK');
        return res.data?.data?.users || res.data?.users || res.data || [];
    } catch (error) {
        console.log(error, 'Lỗi khi lấy data theo nhánh');
        throw error;
    }
};

// Thêm mới người dùng — POST /auth/register
// Body: { user_name, password, email, role_id }
export const registerUser = async (userData) => {
    try {
        const res = await request.post('/auth/register', {
            user_name: userData.user_name,
            password:  userData.password,
            email:     userData.email,
            role_id:   userData.role_id,
        });
        console.log('Thêm mới user OK');
        return res.data;
    } catch (error) {
        console.log(error, 'Lỗi khi thêm mới user');
        throw error;
    }
};

// Xóa người dùng khỏi hệ thống — DELETE /users/:id
export const deleteUser = async (id) => {
    const res = await request.delete(`/users/${id}`);
    return res.data;
};

// Xóa người dùng khỏi chi nhánh — POST /users/remove-branch
// Body: { user_id, branch_id }
export const removeBranch = async (userId, branchId) => {
    try {
        const res = await request.post('/users/remove-branch', {
            user_id:   userId,
            branch_id: branchId,
        });
        console.log('Xóa khỏi chi nhánh OK');
        return res.data;
    } catch (error) {
        console.log(error, 'Lỗi khi xóa khỏi chi nhánh');
        throw error;
    }
};

// Cập nhật thông tin người dùng — PUT /users/:id
// Body: { user_name, user_email, user_phone, user_avatar, user_address }
export const updateUser = async (userId, userData) => {
    try {
        const res = await request.put(`/users/${userId}`, {
            user_name:    userData.user_name,
            user_email:   userData.user_email,
            user_phone:   userData.user_phone   || null,
            user_avatar:  userData.user_avatar  || 'string',
            user_address: userData.user_address || null,
        });
        console.log('Cập nhật người dùng OK');
        return res.data;
    } catch (error) {
        console.log(error, 'Lỗi khi cập nhật người dùng');
        throw error;
    }
};

// Cấp quyền cho người dùng — POST /users/assign-role
// Body: { user_id, role_id }
export const assignRole = async (userId, roleId) => {
    try {
        const res = await request.post('/users/assign-role', {
            user_id: userId,
            role_id: roleId,
        });
        console.log('Cấp quyền OK');
        return res.data;
    } catch (error) {
        console.log(error, 'Lỗi khi cấp quyền');
        throw error;
    }
};

// Gán người dùng vào chi nhánh — POST /users/assign-branch
// Body: { branch_id, user_id }
export const assignBranch = async (userId, branchId) => {
    try {
        const res = await request.post('/users/assign-branch', {
            branch_id: Number(branchId),
            user_id:   userId,
        });
        console.log('Gán chi nhánh OK');
        return res.data;
    } catch (error) {
        console.log(error, 'Lỗi khi gán chi nhánh');
        throw error;
    }
};