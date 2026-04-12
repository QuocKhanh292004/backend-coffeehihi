/** Notification Controller - HTTP handlers for notifications */

const db = require("../models");
const logger = require("../middleware/logger");
const responseUtil = require("../utils/responseUtil");
const ridUtil = require("../utils/ridUtil");
const Notification = db.Notification;

const parseStatusAdmin = (val) => {
  if (val === undefined || val === null || val === "") return undefined;
  if (val === "unread" || val === "0" || val === 0) return 0;
  if (val === "read" || val === "1" || val === 1) return 1;
  return undefined;
};

// Create notification
exports.createNotification = async (req, res) => {
  const correlationId = req.correlationId;
  const { order_id, branch_id } = req.body;

  try {
    const newNotification = await Notification.create({
      rid: ridUtil.generateRid("notif"),
      order_id: order_id || null,
      branch_id,
      status_admin: 0,
      status_client: 0,
    });

    return res
      .status(201)
      .json(
        responseUtil.success(
          req,
          "Tạo thông báo thành công",
          newNotification,
          201,
        ),
      );
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(409)
        .json(responseUtil.conflict(req, "RID đã tồn tại trong hệ thống"));
    }
    logger.error("Create notification failed", { correlationId, error });
    return res
      .status(500)
      .json(responseUtil.serverError(req, "Lỗi server khi tạo thông báo"));
  }
};

// Get notifications
exports.getNotificationsByBranch = async (req, res) => {
  const correlationId = req.correlationId;
  const { branch_id, status_admin } = req.query;

  try {
    const whereClause = {};
    if (branch_id) whereClause.branch_id = branch_id;

    const statusNum = parseStatusAdmin(status_admin);
    if (statusNum !== undefined) whereClause.status_admin = statusNum;

    console.log("=== GET NOTIFICATIONS ===");
    console.log("whereClause:", whereClause);
    console.log("db.Order exists:", !!db.Order);
    console.log(
      "Notification associations:",
      Object.keys(Notification.associations || {}),
    );

    const notifications = await Notification.findAll({
      where: whereClause,
      order: [["sent_time", "DESC"]],
      limit: 50,
    });

    console.log("Found:", notifications.length);

    const mapped = notifications.map((n) => {
      const plain = n.toJSON();
      return {
        notification_id: plain.notification_id,
        rid: plain.rid,
        branch_id: plain.branch_id,
        order_id: plain.order_id,
        related_id: plain.order_id,
        message: `Đơn hàng mới #${plain.order_id}`,
        status_admin: plain.status_admin === 0 ? "unread" : "read",
        status_client: plain.status_client === 0 ? "unread" : "read",
        createdAt: plain.sent_time,
      };
    });

    return res.json(
      responseUtil.success(
        req,
        `Lấy danh sách ${mapped.length} thông báo thành công`,
        { notifications: mapped },
      ),
    );
  } catch (error) {
    // ✅ Log thẳng ra terminal
    console.error("=== GET NOTIFICATIONS ERROR ===");
    console.error("Message:", error.message);
    console.error("Name:", error.name);
    console.error("Stack:", error.stack);

    logger.error("Get notifications failed", {
      correlationId,
      message: error.message,
      stack: error.stack,
    });
    return res
      .status(500)
      .json(
        responseUtil.serverError(req, "Lỗi server khi lấy danh sách thông báo"),
      );
  }
};

// Update notification status
exports.updateNotificationStatus = async (req, res) => {
  const correlationId = req.correlationId;
  const { id } = req.params;
  const { status_admin } = req.body;

  try {
    const updateData = {};

    const statusNum = parseStatusAdmin(status_admin);
    if (statusNum !== undefined) updateData.status_admin = statusNum;

    if (Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .json(
          responseUtil.validationError(req, "Không có dữ liệu để cập nhật"),
        );
    }

    const [updatedRows] = await Notification.update(updateData, {
      where: { notification_id: id },
    });

    if (updatedRows === 0) {
      return res
        .status(404)
        .json(responseUtil.notFound(req, "Không tìm thấy thông báo"));
    }

    return res.json(
      responseUtil.success(req, "Cập nhật trạng thái thông báo thành công"),
    );
  } catch (error) {
    console.error("=== UPDATE NOTIFICATION ERROR ===");
    console.error("Message:", error.message);
    logger.error("Update notification status failed", {
      correlationId,
      message: error.message,
      stack: error.stack,
    });
    return res
      .status(500)
      .json(
        responseUtil.serverError(
          req,
          "Lỗi server khi cập nhật trạng thái thông báo",
        ),
      );
  }
};
