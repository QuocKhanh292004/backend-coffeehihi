/** Branch Controller - HTTP handlers for branch management */

const db = require("../models");
const logger = require("../middleware/logger");
const responseUtil = require("../utils/responseUtil");
const imageUtil = require("../utils/imageUtil");
const ridUtil = require("../utils/ridUtil");

// Get all branches
exports.getAllBranches = async (req, res) => {
  const correlationId = req.correlationId;

  try {
    const branches = await db.Branch.findAll({
      where: { is_delete: false },
      include: [
        {
          model: db.User,
          as: "Users", // ✅ khớp với alias trong index.js
          attributes: ["user_id", "user_name", "email"],
          through: { attributes: [] },
        },
      ],
    });

    imageUtil.attachFullUrls(branches, req);

    return res.json(
      responseUtil.success(
        req,
        `Lấy danh sách ${branches.length} chi nhánh thành công`,
        branches,
      ),
    );
  } catch (error) {
    logger.error("Get all branches failed", { correlationId, error });
    return res
      .status(500)
      .json(
        responseUtil.serverError(req, "Lỗi server khi lấy danh sách chi nhánh"),
      );
  }
};

// Get branch detail
exports.getBranchDetail = async (req, res) => {
  const correlationId = req.correlationId;
  const { id } = req.params;

  try {
    const branch = await db.Branch.findOne({
      where: { branch_id: id, is_delete: false },
      include: [
        {
          model: db.Table,
          where: { is_delete: false },
          required: false,
        },
        {
          model: db.MenuCategory,
          where: { is_delete: false },
          required: false,
        },
        {
          model: db.User,
          as: "Users", // ✅ khớp với alias trong index.js
          attributes: ["user_id", "user_name", "email"],
          through: { attributes: [] },
        },
      ],
    });

    if (!branch) {
      return res
        .status(404)
        .json(
          responseUtil.notFound(
            req,
            "Không tìm thấy chi nhánh hoặc chi nhánh đã bị xóa",
          ),
        );
    }

    imageUtil.attachFullUrls(branch, req);

    return res.json(
      responseUtil.success(req, "Lấy thông tin chi nhánh thành công", branch),
    );
  } catch (error) {
    logger.error("Get branch detail failed", {
      correlationId,
      context: { branchId: id },
      error,
    });
    return res
      .status(500)
      .json(
        responseUtil.serverError(req, "Lỗi server khi lấy thông tin chi nhánh"),
      );
  }
};

// Create branch
exports.createBranch = async (req, res) => {
  const correlationId = req.correlationId;
  const { branch_name, description } = req.body;

  try {
    const payload = {
      rid: ridUtil.generateRid("br"),
      branch_name,
      description,
      is_delete: false,
    };

    if (req.file) {
      const validation = imageUtil.validateImageFile(
        req.file.buffer,
        req.file.originalname,
      );
      if (!validation.isValid) {
        return res.status(400).json(
          responseUtil.validationError(req, validation.error, {
            file: validation.error,
          }),
        );
      }
      payload.branch_image = imageUtil.saveBranchImage(req.file.buffer, "new");
    }

    const newBranch = await db.Branch.create(payload);
    imageUtil.attachFullUrls(newBranch, req);

    return res
      .status(201)
      .json(
        responseUtil.success(req, "Tạo chi nhánh thành công", newBranch, 201),
      );
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(409)
        .json(responseUtil.conflict(req, "RID đã tồn tại trong hệ thống"));
    }
    logger.error("Create branch failed", { correlationId, error });
    return res
      .status(500)
      .json(responseUtil.serverError(req, "Lỗi server khi tạo chi nhánh"));
  }
};

// Update branch
exports.updateBranch = async (req, res) => {
  const correlationId = req.correlationId;
  const { id } = req.params;
  const { branch_name, description } = req.body;

  try {
    const branch = await db.Branch.findOne({
      where: { branch_id: id, is_delete: false },
    });
    if (!branch) {
      return res
        .status(404)
        .json(
          responseUtil.notFound(
            req,
            "Không tìm thấy chi nhánh hoặc chi nhánh đã bị xóa",
          ),
        );
    }

    let imagePath;
    if (req.file) {
      const validation = imageUtil.validateImageFile(
        req.file.buffer,
        req.file.originalname,
      );
      if (!validation.isValid) {
        return res.status(400).json(
          responseUtil.validationError(req, validation.error, {
            file: validation.error,
          }),
        );
      }
      imagePath = imageUtil.updateBranchImage(
        req.file.buffer,
        id,
        branch.branch_image,
      );
    }

    const updatePayload = { branch_name, description };
    if (imagePath) updatePayload.branch_image = imagePath;

    const [updatedRows] = await db.Branch.update(updatePayload, {
      where: { branch_id: id, is_delete: false },
    });

    if (updatedRows === 0) {
      return res
        .status(404)
        .json(
          responseUtil.notFound(
            req,
            "Không tìm thấy chi nhánh hoặc chi nhánh đã bị xóa",
          ),
        );
    }

    const updatedBranch = await db.Branch.findByPk(id);
    imageUtil.attachFullUrls(updatedBranch, req);

    return res.json(
      responseUtil.success(req, "Cập nhật chi nhánh thành công", updatedBranch),
    );
  } catch (error) {
    logger.error("Update branch failed", { correlationId, error });
    return res
      .status(500)
      .json(responseUtil.serverError(req, "Lỗi server khi cập nhật chi nhánh"));
  }
};

// Delete branch (soft delete)
exports.deleteBranch = async (req, res) => {
  const correlationId = req.correlationId;
  const { id } = req.params;

  try {
    const [updatedRows] = await db.Branch.update(
      { is_delete: true },
      { where: { branch_id: id, is_delete: false } },
    );

    if (updatedRows === 0) {
      return res
        .status(404)
        .json(
          responseUtil.notFound(
            req,
            "Không tìm thấy chi nhánh hoặc chi nhánh đã bị xóa",
          ),
        );
    }

    return res.json(responseUtil.success(req, "Xóa chi nhánh thành công"));
  } catch (error) {
    logger.error("Delete branch failed", { correlationId, error });
    return res
      .status(500)
      .json(responseUtil.serverError(req, "Lỗi server khi xóa chi nhánh"));
  }
};
