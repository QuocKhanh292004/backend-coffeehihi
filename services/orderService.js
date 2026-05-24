/** Order Service - Order management operations */

const db = require("../models");
const auditUtil = require("../utils/auditUtil");
const ridUtil = require("../utils/ridUtil");

const { Order, OrderItem, MenuItem } = db;

const calcTotal = (orderItems = []) => {
  return orderItems.reduce((sum, item) => {
    return sum + Number(item.price ?? 0) * Number(item.quantity ?? 1);
  }, 0);
};

exports.createOrder = async (orderData) => {
  const { table_id, branch_id, notes } = orderData;

  const order = await Order.create({
    rid: ridUtil.generateRid("ord"),
    table_id,
    branch_id,
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
        // ✅ Bỏ attributes để lấy tất cả fields (bao gồm note)
        include: [
          {
            model: MenuItem,
            as: "menuItem",
            attributes: ["item_id", "item_name", "price"],
          },
        ],
      },
      {
        model: db.Branch,
        as: "Branch",
        attributes: ["branch_id", "branch_name"],
      },
      {
        model: db.Table,
        as: "Table",
        attributes: ["table_id", "table_name"],
      },
    ],
  });

  if (!order) throw new Error("Order not found");

  const plain = order.toJSON();
  plain.total_price = calcTotal(plain.OrderItems);

  return plain;
};

exports.getAllOrders = async (page = 1, limit = 10, filters = {}) => {
  const offset = (page - 1) * limit;
  const where = {};

  if (filters.status) where.order_status = filters.status;
  if (filters.table_id) where.table_id = filters.table_id;
  if (filters.branch_id) where.branch_id = filters.branch_id;

  const { count, rows } = await Order.findAndCountAll({
    where,
    include: [
      {
        model: OrderItem,
        as: "OrderItems",
        // ✅ Bỏ attributes để lấy tất cả fields (bao gồm note)
        include: [
          {
            model: MenuItem,
            as: "menuItem",
            attributes: ["item_id", "item_name", "price"],
          },
        ],
      },
      {
        model: db.Branch,
        as: "Branch",
        attributes: ["branch_id", "branch_name"],
      },
      {
        model: db.Table,
        as: "Table",
        attributes: ["table_id", "table_name"],
      },
    ],
    limit,
    offset,
    order: [["order_time", "DESC"]],
    distinct: true,
  });

  const orders = rows.map((row) => {
    const plain = row.toJSON();
    plain.total_price = calcTotal(plain.OrderItems);
    return plain;
  });

  return {
    orders,
    total: count,
    page,
    limit,
    totalPages: Math.ceil(count / limit),
  };
};

exports.recalculateOrderTotal = async (orderId) => {
  return 0;
};

exports.getUserOrders = async (userId, page = 1, limit = 10) => {
  return exports.getAllOrders(page, limit, { user_id: userId });
};

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
  if (!order) throw new Error("Order not found");

  const oldStatus = order.order_status;
  order.order_status = newStatus;
  await order.save();

  await auditUtil.logAction({
    userId: auditContext.userId,
    action: "order_status_changed",
    details: {
      order_id: orderId,
      old_status: oldStatus,
      new_status: newStatus,
    },
  });

  return await exports.getOrderById(orderId);
};

exports.cancelOrder = async (orderId, reason = "") => {
  const order = await Order.findOne({ where: { order_id: orderId } });
  if (!order) throw new Error("Order not found");

  if (["completed", "cancelled"].includes(order.order_status)) {
    throw new Error(`Cannot cancel order with status: ${order.order_status}`);
  }

  order.order_status = "cancelled";
  await order.save();

  return order;
};

exports.addOrderItem = async (
  orderId,
  itemId,
  quantity,
  price = null,
  note = null,
) => {
  const order = await Order.findOne({ where: { order_id: orderId } });
  if (!order) throw new Error("Order not found");

  const menuItem = await MenuItem.findOne({ where: { item_id: itemId } });
  if (!menuItem) throw new Error("Menu item not found");

  if (quantity < 1) throw new Error("Quantity must be at least 1");

  // ✅ Dùng price từ frontend nếu có (đã gồm topping), fallback về menuItem.price
  const finalPrice = price != null ? price : menuItem.price;

  let orderItem = await OrderItem.findOne({
    where: { order_id: orderId, item_id: itemId },
  });

  if (orderItem) {
    orderItem.quantity += quantity;
    // ✅ Cập nhật note nếu có
    if (note != null) orderItem.note = note;
    await orderItem.save();
  } else {
    orderItem = await OrderItem.create({
      rid: ridUtil.generateRid("oi"),
      order_id: orderId,
      item_id: itemId,
      quantity,
      price: finalPrice, // ✅ giá thực từ frontend
      note: note ?? null, // ✅ ghi chú từng món
    });
  }

  return orderItem;
};

exports.updateOrderItemQuantity = async (orderItemId, newQuantity) => {
  const orderItem = await OrderItem.findOne({ where: { id: orderItemId } });
  if (!orderItem) throw new Error("Order item not found");
  if (newQuantity < 1) throw new Error("Quantity must be at least 1");

  orderItem.quantity = newQuantity;
  await orderItem.save();
  await exports.recalculateOrderTotal(orderItem.order_id);

  return orderItem;
};

exports.removeOrderItem = async (orderItemId) => {
  const orderItem = await OrderItem.findOne({ where: { id: orderItemId } });
  if (!orderItem) throw new Error("Order item not found");

  const orderId = orderItem.order_id;
  await orderItem.destroy();
  await exports.recalculateOrderTotal(orderId);

  return { success: true, message: "Item removed from order" };
};

exports.getOrderStatistics = async (filters = {}) => {
  const where = {};

  if (filters.branch_id) where.branch_id = filters.branch_id;
  if (filters.dateFrom || filters.dateTo) {
    where.order_time = {};
    if (filters.dateFrom)
      where.order_time[db.Sequelize.Op.gte] = filters.dateFrom;
    if (filters.dateTo) where.order_time[db.Sequelize.Op.lte] = filters.dateTo;
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

  return {
    total,
    byStatus: Object.fromEntries(
      byStatus.map((s) => [s.order_status, s.count]),
    ),
  };
};

exports.getDashboardStats = async (filters = {}) => {
  const where = {};
  if (filters.branch_id) where.branch_id = filters.branch_id;

  const totalOrders = await Order.count({ where });

  const completedOrders = await Order.findAll({
    where: { ...where, order_status: "completed" },
    include: [
      { model: OrderItem, as: "OrderItems", attributes: ["price", "quantity"] },
    ],
  });
  const totalRevenue = completedOrders.reduce((sum, order) => {
    return sum + calcTotal(order.OrderItems ?? []);
  }, 0);

  const distinctItems = await OrderItem.findAll({
    attributes: [
      [
        db.Sequelize.fn(
          "COUNT",
          db.Sequelize.fn("DISTINCT", db.Sequelize.col("item_id")),
        ),
        "count",
      ],
    ],
    include: [{ model: Order, as: "Order", where, attributes: [] }],
    raw: true,
  });
  const totalItems = parseInt(distinctItems[0]?.count ?? 0);

  const distinctTables = await Order.findAll({
    where,
    attributes: [
      [
        db.Sequelize.fn(
          "COUNT",
          db.Sequelize.fn("DISTINCT", db.Sequelize.col("table_id")),
        ),
        "count",
      ],
    ],
    raw: true,
  });
  const totalTables = parseInt(distinctTables[0]?.count ?? 0);
  const monthRevenue = 12;

  return { totalRevenue, totalOrders, totalItems, totalTables, monthRevenue };
};
