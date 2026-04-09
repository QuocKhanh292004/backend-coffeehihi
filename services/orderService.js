/** Order Service - Order management operations
 * createOrder, getOrderById, getAllOrders, getUserOrders, updateOrderStatus
 * cancelOrder, addOrderItem, updateOrderItemQuantity, removeOrderItem, recalculateOrderTotal
 * getOrderStatistics
 */

const db = require("../models");
const auditUtil = require("../utils/auditUtil");
const ridUtil = require("../utils/ridUtil");

const { Order, OrderItem, MenuItem, User } = db;

// ✅ createOrder — chỉ dùng cột thật trong DB
exports.createOrder = async (orderData) => {
  const { table_id, notes } = orderData;

  const order = await Order.create({
    rid: ridUtil.generateRid("ord"),
    table_id: table_id,
    order_status: "pending",
    order_note: notes || "",
  });

  return order;
};

exports.getOrderById = async (orderId) => {
  const order = await Order.findOne({
    where: { order_id: orderId },
    include: [
      {
        model: OrderItem,
        as: "OrderItems",
        include: [
          {
            model: MenuItem,
            as: "menuItem",
            attributes: ["item_id", "item_name", "price"],
          },
        ],
      },
    ],
  });

  if (!order) throw new Error("Order not found");
  return order;
};

exports.getAllOrders = async (page = 1, limit = 10, filters = {}) => {
  const offset = (page - 1) * limit;
  const where = {}; // ❌ bỏ is_delete: false

  if (filters.status) where.order_status = filters.status;
  // ❌ bỏ filters.branch_id và filters.user_id (không có cột này)

  const { count, rows } = await Order.findAndCountAll({
    where,
    include: [
      {
        model: OrderItem,
        as: "OrderItems",
        attributes: ["quantity"],
        // ❌ bỏ unit_price (cột thật là 'price' trong order_items)
      },
    ],
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });

  return {
    orders: rows,
    total: count,
    page,
    limit,
    totalPages: Math.ceil(count / limit),
  };
};

// ✅ recalculateOrderTotal — bảng không có total_amount, nên giữ làm no-op để tránh ghi vào cột không tồn tại
exports.recalculateOrderTotal = async (orderId) => {
  return 0;
};

// Get user orders - Fetch all orders for specific user
exports.getUserOrders = async (userId, page = 1, limit = 10) => {
  return exports.getAllOrders(page, limit, { user_id: userId });
};

// Update order status - Validate status, update, log change
exports.updateOrderStatus = async (orderId, newStatus, auditContext = {}) => {
  const validStatuses = [
    "pending",
    "confirmed",
    "preparing",
    "ready",
    "completed",
    "cancelled",
  ];

  if (!validStatuses.includes(newStatus)) {
    throw new Error(
      `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
    );
  }

  const order = await Order.findOne({ where: { order_id: orderId } });

  if (!order) {
    throw new Error("Order not found");
  }

  const oldStatus = order.order_status;
  order.order_status = newStatus;
  await order.save();

  // Log status change
  await auditUtil.logAction(auditContext.userId, "order_status_changed", {
    order_id: orderId,
    old_status: oldStatus,
    new_status: newStatus,
  });

  return await exports.getOrderById(orderId);
};

// Cancel order - Validate status, change to cancelled
exports.cancelOrder = async (orderId, reason = "") => {
  const order = await Order.findOne({ where: { order_id: orderId } });

  if (!order) {
    throw new Error("Order not found");
  }

  if (["completed", "cancelled"].includes(order.order_status)) {
    throw new Error(`Cannot cancel order with status: ${order.order_status}`);
  }

  order.order_status = "cancelled";
  await order.save();

  return order;
};

// Add order item
exports.addOrderItem = async (orderId, itemId, quantity) => {
  const order = await Order.findOne({ where: { order_id: orderId } });
  if (!order) throw new Error("Order not found");

  const menuItem = await MenuItem.findOne({ where: { item_id: itemId } });
  if (!menuItem) throw new Error("Menu item not found");

  if (quantity < 1) throw new Error("Quantity must be at least 1");

  let orderItem = await OrderItem.findOne({
    where: { order_id: orderId, item_id: itemId },
  });

  if (orderItem) {
    orderItem.quantity += quantity;
    await orderItem.save();
  } else {
    orderItem = await OrderItem.create({
      rid: ridUtil.generateRid("oi"),
      order_id: orderId,
      item_id: itemId,
      quantity,
      price: menuItem.price, // ✅ đúng tên cột (không phải unit_price)
    });
  }

  return orderItem;
};

// Update order item quantity - Validate & update quantity, recalculate total
exports.updateOrderItemQuantity = async (orderItemId, newQuantity) => {
  const orderItem = await OrderItem.findOne({ where: { id: orderItemId } });

  if (!orderItem) {
    throw new Error("Order item not found");
  }

  if (newQuantity < 1) {
    throw new Error("Quantity must be at least 1");
  }

  orderItem.quantity = newQuantity;
  await orderItem.save();

  // Recalculate order total
  await exports.recalculateOrderTotal(orderItem.order_id);

  return orderItem;
};

// Remove order item - Delete item, recalculate order total
exports.removeOrderItem = async (orderItemId) => {
  const orderItem = await OrderItem.findOne({ where: { id: orderItemId } });

  if (!orderItem) {
    throw new Error("Order item not found");
  }

  const orderId = orderItem.order_id;
  await orderItem.destroy();

  // Recalculate order total
  await exports.recalculateOrderTotal(orderId);

  return { success: true, message: "Item removed from order" };
};

// Get order statistics
exports.getOrderStatistics = async (filters = {}) => {
  const where = { is_delete: false };

  if (filters.branch_id) where.branch_id = filters.branch_id;
  if (filters.dateFrom || filters.dateTo) {
    where.created_at = {};
    if (filters.dateFrom)
      where.created_at[db.Sequelize.Op.gte] = filters.dateFrom;
    if (filters.dateTo) where.created_at[db.Sequelize.Op.lte] = filters.dateTo;
  }

  const total = await Order.count({ where });

  const byStatus = await Order.findAll({
    where,
    attributes: [
      "order_status",
      [db.Sequelize.fn("COUNT", db.Sequelize.col("order_id")), "count"],
    ],
    group: ["order_status"],
    raw: true,
  });

  const totalRevenue = await Order.findOne({
    where,
    attributes: [
      [db.Sequelize.fn("SUM", db.Sequelize.col("total_amount")), "total"],
    ],
  });

  return {
    total,
    byStatus: Object.fromEntries(
      byStatus.map((s) => [s.order_status, s.count]),
    ),
    totalRevenue: parseFloat(totalRevenue?.dataValues?.total || 0),
  };
};
