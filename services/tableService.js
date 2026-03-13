/** Table Service - Table management operations */

const db = require("../models");
const ridUtil = require("../utils/ridUtil");
const { Table, Branch } = db;

// Get all tables
exports.getAllTables = async (page = 1, limit = 100, filters = {}) => {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.max(1, Number(limit) || 100);
  const offset = (safePage - 1) * safeLimit;

  const where = { is_delete: false };
  if (filters.branch_id) where.branch_id = Number(filters.branch_id);

  const { count, rows } = await Table.findAndCountAll({
    where,
    attributes: [
      "table_id",
      "rid",
      "table_name",
      "description",
      "branch_id",
      "capacity",
      "status",
      "is_delete",
    ],
    include: [{ model: Branch, attributes: ["branch_id", "branch_name"] }],
    limit: safeLimit,
    offset,
    order: [["table_id", "DESC"]],
  });

  return { tables: rows, total: count, page: safePage, limit: safeLimit };
};

// Get table by ID
exports.getTableById = async (tableId) => {
  const table = await Table.findOne({
    where: { table_id: tableId, is_delete: false },
    attributes: [
      "table_id",
      "rid",
      "table_name",
      "description",
      "branch_id",
      "capacity",
      "status",
      "is_delete",
    ],
    include: [{ model: Branch, attributes: ["branch_id", "branch_name"] }],
  });
  if (!table) throw new Error("Table not found");
  return table;
};

// Create table
exports.createTable = async (data) => {
  const { table_name, branch_id, capacity, status, description } = data;
  if (!table_name || !branch_id) {
    throw new Error("table_name and branch_id are required");
  }
  return await Table.create({
    rid: ridUtil.generateRid("tbl"),
    table_name,
    branch_id,
    capacity: capacity || 0,
    status: status || "available",
    description: description || "",
    is_delete: false,
  });
};

// Update table
exports.updateTable = async (tableId, data) => {
  const table = await exports.getTableById(tableId);
  return await table.update(data);
};

// Delete table (soft delete)
exports.deleteTable = async (tableId) => {
  const table = await exports.getTableById(tableId);
  table.is_delete = true;
  return await table.save();
};
