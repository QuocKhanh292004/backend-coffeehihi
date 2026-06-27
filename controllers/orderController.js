/** Order Controller - Order management HTTP handling */

const logger = require("../middleware/logger");
const responseUtil = require("../utils/responseUtil");
const validationUtil = require("../utils/validationUtil");
const { orderService } = require("../services");
const ridUtil = require("../utils/ridUtil");
const db = require("../models");

const STATUS_LABEL = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  preparing: "Đang chuẩn bị",
  ready: "Sẵn sàng phục vụ",
  completed: "Đã hoàn thành",
  cancelled: "Đã huỷ",
};

const createAndEmitNotification = async (req, order, branch_id) => {
  try {
    const io = req.app.get("io");

    const notification = await db.Notification.create({
      rid: ridUtil.generateRid("notif"),
      order_id: order.order_id,
      branch_id: branch_id,
      status_admin: 0,
      status_client: 0,
    });

    const payload = {
      notification_id: notification.notification_id,
      message: `Đơn hàng mới #${order.order_id} từ bàn ${order.table_id}`,
      related_id: order.order_id,
      order_id: order.order_id,
      branch_id: branch_id,
      status_admin: "unread",
      createdAt: notification.createdAt ?? new Date().toISOString(),
    };

    if (io) {
      io.to(`branch_${branch_id}`).emit("new_order", payload);
      io.to("admin_room").emit("new_order", payload);
      logger.info("Socket emitted new_order", {
        branch_id,
        orderId: order.order_id,
      });
    }

    return notification;
  } catch (err) {
    logger.warn("createAndEmitNotification failed", { error: err.message });
  }
};

// Create order
exports.createOrder = async (req, res) => {
  const correlationId = req.correlationId;
  const { table_id, branch_id, notes, order_items } = req.body;

  if (!table_id || !branch_id || !order_items || order_items.length === 0) {
    return res
      .status(400)
      .json(
        responseUtil.validationError(
          req,
          "table_id, branch_id và order_items là bắt buộc",
        ),
      );
  }

  try {
    const order = await orderService.createOrder({
      table_id,
      branch_id,
      notes,
    });
    const fullOrder = await orderService.getOrderById(order.order_id);

    await createAndEmitNotification(req, order, branch_id);

    logger.info("Order created", {
      correlationId,
      context: { orderId: order.order_id },
    });

    return res
      .status(201)
      .json(
        responseUtil.success(req, "Order created successfully", fullOrder, 201),
      );
  } catch (error) {
    logger.error("Create order failed", {
      correlationId,
      message: error.message,
      name: error.name,
      stack: error.stack,
      sequelizeErrors: error.errors?.map((e) => ({
        field: e.path,
        message: e.message,
        value: e.value,
      })),
    });

    return res
      .status(500)
      .json(responseUtil.serverError(req, "Error creating order"));
  }
};

// Get order detail
exports.getOrderDetail = async (req, res) => {
  const correlationId = req.correlationId;
  const { id } = req.params;

  try {
    const order = await orderService.getOrderById(parseInt(id));
    logger.info("Order retrieved", { correlationId, context: { orderId: id } });
    return res.json(
      responseUtil.success(req, "Order retrieved successfully", order),
    );
  } catch (error) {
    logger.warn("Order not found", { correlationId, context: { orderId: id } });
    return res.status(404).json(responseUtil.notFound(req, "Order not found"));
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  const correlationId = req.correlationId;
  const { page = 1, limit = 10, status, branch_id, table_id } = req.query;

  try {
    const filters = {};
    if (status) filters.status = status;
    if (branch_id) filters.branch_id = branch_id;
    if (table_id) filters.table_id = table_id;

    const result = await orderService.getAllOrders(
      parseInt(page),
      parseInt(limit),
      filters,
    );

    logger.info("Orders retrieved", {
      correlationId,
      context: { count: result.total },
    });

    return res.json(
      responseUtil.success(req, `Retrieved ${result.total} orders`, result),
    );
  } catch (error) {
    logger.error("Get all orders failed", { correlationId, error });
    return res
      .status(500)
      .json(responseUtil.serverError(req, "Error retrieving orders"));
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  const correlationId = req.correlationId;
  const { id } = req.params;
  const { status } = req.body;
  const userId = req.user?.user_id;

  if (!status) {
    return res
      .status(400)
      .json(responseUtil.validationError(req, "status is required"));
  }

  try {
    const order = await orderService.updateOrderStatus(parseInt(id), status, {
      userId,
    });

    // ✅ Emit order_status_updated với đầy đủ thông tin
    try {
      const io = req.app.get("io");
      if (io) {
        // Lấy thêm Branch và Table name
        const fullOrder = await db.Order.findOne({
          where: { order_id: parseInt(id) },
          include: [
            { model: db.Branch, attributes: ["branch_id", "branch_name"] },
            { model: db.Table, attributes: ["table_id", "table_name"] },
          ],
        });

        const payload = {
          order_id: parseInt(id),
          new_status: status,
          status_label: STATUS_LABEL[status] ?? status,
          table_id: fullOrder?.table_id,
          table_name:
            fullOrder?.Table?.table_name ?? `Bàn ${fullOrder?.table_id}`,
          branch_id: fullOrder?.branch_id,
          branch_name:
            fullOrder?.Branch?.branch_name ??
            `Chi nhánh ${fullOrder?.branch_id}`,
          message: `Đơn hàng #${id} tại ${fullOrder?.Table?.table_name ?? "bàn " + fullOrder?.table_id} - ${fullOrder?.Branch?.branch_name ?? ""} ${STATUS_LABEL[status] ?? status}`,
          timestamp: new Date().toISOString(),
        };

        if (fullOrder?.branch_id) {
          io.to(`branch_${fullOrder.branch_id}`).emit(
            "order_status_updated",
            payload,
          );
        }
        io.to("admin_room").emit("order_status_updated", payload);

        if (fullOrder?.table_id) {
          io.to(`table_${fullOrder.table_id}`).emit(
            "order_status_updated",
            payload,
          );
        }
      }
    } catch (socketErr) {
      logger.warn("Socket emit order_status_updated failed", {
        error: socketErr.message,
      });
    }

    logger.info("Order status updated", {
      correlationId,
      context: { orderId: id, newStatus: status },
    });

    return res.json(
      responseUtil.success(req, "Order status updated successfully", order),
    );
  } catch (error) {
    logger.warn("Update order status failed", {
      correlationId,
      context: { orderId: id },
      error,
    });
    return res
      .status(400)
      .json(
        responseUtil.validationError(
          req,
          error.message || "Error updating order",
        ),
      );
  }
};

// Delete order
exports.deleteOrder = async (req, res) => {
  const correlationId = req.correlationId;
  const { id } = req.params;

  try {
    await orderService.cancelOrder(parseInt(id));
    logger.info("Order cancelled", { correlationId, context: { orderId: id } });
    return res.json(responseUtil.success(req, "Order cancelled successfully"));
  } catch (error) {
    logger.warn("Delete order failed", {
      correlationId,
      context: { orderId: id },
    });
    return res.status(404).json(responseUtil.notFound(req, "Order not found"));
  }
};

// Add item to order
exports.addItemToOrder = async (req, res) => {
  const correlationId = req.correlationId;
  const { order_id, item_id, quantity, price, note } = req.body;

  const validation = validationUtil.validateRequiredFields(req.body, [
    "order_id",
    "item_id",
    "quantity",
  ]);
  if (!validation.isValid) {
    return res
      .status(400)
      .json(
        responseUtil.validationError(
          req,
          "order_id, item_id, quantity required",
        ),
      );
  }

  try {
    const orderItem = await orderService.addOrderItem(
      parseInt(order_id),
      parseInt(item_id),
      parseInt(quantity),
      price ?? null,
      note ?? null,
    );

    logger.info("Item added to order", {
      correlationId,
      context: { orderId: order_id, itemId: item_id },
    });

    return res.json(
      responseUtil.success(req, "Item added to order successfully", orderItem),
    );
  } catch (error) {
    logger.warn("Add item to order failed", { correlationId, error });
    return res
      .status(404)
      .json(
        responseUtil.notFound(req, error.message || "Order or item not found"),
      );
  }
};

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
  const { branch_id } = req.query;
  try {
    const filters = {};
    if (branch_id) filters.branch_id = branch_id;
    const stats = await orderService.getDashboardStats(filters);
    return res.json(responseUtil.success(req, "Stats retrieved", stats));
  } catch (error) {
    logger.error("Get dashboard stats failed", { error });
    return res
      .status(500)
      .json(responseUtil.serverError(req, "Error retrieving stats"));
  }
};
