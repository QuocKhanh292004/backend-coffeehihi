/** User Service - User management operations */

const db = require("../models");
const bcrypt = require("bcryptjs");
const auditUtil = require("../utils/auditUtil");
const ridUtil = require("../utils/ridUtil");

const { User, Role, Branch } = db;

// Get all users with pagination & filters
exports.getAllUsers = async (page = 1, limit = 10, filters = {}) => {
  const offset = (page - 1) * limit;
  const where = {};

  if (filters.role_id) where.role_id = filters.role_id;
  if (filters.is_active !== undefined) where.is_active = filters.is_active;
  if (filters.search) {
    where[db.Sequelize.Op.or] = [
      { user_name: { [db.Sequelize.Op.like]: `%${filters.search}%` } },
      { email: { [db.Sequelize.Op.like]: `%${filters.search}%` } },
    ];
  }

  const { count, rows } = await User.findAndCountAll({
    where,
    include: [
      {
        model: db.Role,
        as: "role",
        attributes: ["role_id", "role_name", "permissions"],
      },
    ],
    limit,
    offset,
    order: [["created_at", "DESC"]],
    subQuery: false,
  });

  return {
    users: rows,
    total: count,
    page,
    limit,
    totalPages: Math.ceil(count / limit),
  };
};

// Create user - Hash password, create user account
exports.create = async (userData) => {
  const { user_name, password, email, role_id } = userData;

  if (!user_name || !password) {
    throw new Error("user_name and password are required");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  return await User.create({
    rid: ridUtil.generateRid("usr"),
    user_name,
    password: hashedPassword,
    email: email || null,
    role_id: role_id || 4,
    is_active: true,
  });
};

// Get user by ID with role & branches
exports.getUserById = async (userId) => {
  const user = await User.findOne({
    where: { user_id: userId },
    include: [
      {
        model: db.Role,
        as: "role",
        attributes: ["role_id", "role_name", "permissions", "is_active"],
      },
      {
        model: db.Branch,
        as: "Branches", // ✅ khớp với alias trong index.js
        through: { attributes: [] },
        attributes: ["branch_id", "branch_name"],
      },
    ],
  });

  if (!user) throw new Error("User not found");
  return user;
};

// Update user info
exports.updateUser = async (userId, updateData) => {
  const user = await User.findOne({ where: { user_id: userId } });
  if (!user) throw new Error("User not found");

  const allowedFields = [
    "user_name",
    "user_phone",
    "user_address",
    "role_id",
    "is_active",
  ];
  const updates = {};
  for (const field of allowedFields) {
    if (field in updateData) updates[field] = updateData[field];
  }

  await user.update(updates);
  return await exports.getUserById(userId);
};

// Delete user - Hard delete, log action
exports.deleteUser = async (userId, auditContext = {}) => {
  const user = await User.findOne({ where: { user_id: userId } });
  if (!user) throw new Error("User not found");

  await User.destroy({ where: { user_id: userId } });

  await auditUtil.logAction(userId, "account_deleted", {
    deleted_user_id: userId,
    ...auditContext,
  });

  return { success: true, message: "User deleted successfully" };
};

// Assign user to branches - Raw query to avoid Sequelize timestamp injection
exports.assignBranches = async (userId, branchIds) => {
  const user = await User.findOne({ where: { user_id: userId } });
  if (!user) throw new Error("User not found");

  const branches = await Branch.findAll({
    where: { branch_id: { [db.Sequelize.Op.in]: branchIds } },
  });

  if (branches.length !== branchIds.length) {
    throw new Error("One or more branches not found");
  }

  // ✅ Raw query - tránh Sequelize tự thêm createdAt/updatedAt
  for (const branchId of branchIds) {
    await db.sequelize.query(
      `INSERT IGNORE INTO userbranch (user_id, branch_id) VALUES (:userId, :branchId)`,
      {
        replacements: { userId, branchId },
        type: db.Sequelize.QueryTypes.INSERT,
      },
    );
  }

  return {
    success: true,
    message: "User assigned to branches successfully",
    branches,
  };
};

// Get user branches
exports.getUserBranches = async (userId) => {
  const user = await User.findOne({
    where: { user_id: userId },
    include: [
      {
        model: Branch,
        as: "Branches", // ✅ khớp với alias trong index.js
        through: { attributes: [] },
        attributes: ["branch_id", "branch_name", "description"],
      },
    ],
  });
  return user?.Branches || [];
};

// Get user permissions
exports.getUserPermissions = async (userId) => {
  const user = await User.findOne({
    where: { user_id: userId },
    include: [{ model: Role, as: "role", attributes: ["permissions"] }],
  });

  if (!user) throw new Error("User not found");
  return user.role?.permissions || {};
};

// Check single permission
exports.hasPermission = async (userId, permission) => {
  const permissions = await exports.getUserPermissions(userId);
  return permissions[permission] === true;
};

// Check any permission
exports.hasAnyPermission = async (userId, permissions) => {
  const userPermissions = await exports.getUserPermissions(userId);
  return permissions.some((perm) => userPermissions[perm] === true);
};

// Change user role
exports.changeUserRole = async (userId, newRoleId, auditContext = {}) => {
  const user = await User.findOne({ where: { user_id: userId } });
  if (!user) throw new Error("User not found");

  const role = await Role.findOne({ where: { role_id: newRoleId } });
  if (!role) throw new Error("Role not found");

  const oldRoleId = user.role_id;
  user.role_id = newRoleId;
  await user.save();

  await auditUtil.logAction(userId, "role_changed", {
    old_role_id: oldRoleId,
    new_role_id: newRoleId,
    ...auditContext,
  });

  return await exports.getUserById(userId);
};

// Count users by role
exports.countUsersByRole = async () => {
  return await User.findAll({
    where: { is_delete: false },
    attributes: [
      "role_id",
      [db.Sequelize.fn("COUNT", db.Sequelize.col("user_id")), "count"],
    ],
    include: [{ model: Role, as: "role", attributes: ["role_name"] }],
    group: ["role_id", "role.role_id"],
    raw: true,
  });
};

// Get user statistics
exports.getUserStatistics = async () => {
  const total = await User.count({ where: { is_delete: false } });
  const active = await User.count({
    where: { is_delete: false, is_active: true },
  });
  const locked = await User.count({
    where: { is_delete: false, lock_up: true },
  });
  const emailVerified = await User.count({
    where: { is_delete: false, email_verified: true },
  });

  return {
    total,
    active,
    inactive: total - active,
    locked,
    emailVerified,
    notVerified: total - emailVerified,
  };
};
