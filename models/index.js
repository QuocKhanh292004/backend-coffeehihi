// models/index.js
const { Sequelize } = require("sequelize");
const dbConfig = require("../config/database").development;

const sequelize = new Sequelize(dbConfig);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// --- Định nghĩa Models ---
db.Role = require("./role")(sequelize, Sequelize.DataTypes);
db.Branch = require("./branch")(sequelize, Sequelize.DataTypes);
db.User = require("./user")(sequelize, Sequelize.DataTypes);
db.UserBranch = require("./userbranch")(sequelize, Sequelize.DataTypes);
db.Table = require("./table")(sequelize, Sequelize.DataTypes);
db.MenuCategory = require("./menu_category")(sequelize, Sequelize.DataTypes);
db.MenuItem = require("./menu_item")(sequelize, Sequelize.DataTypes);
db.Order = require("./order")(sequelize, Sequelize.DataTypes);
db.OrderItem = require("./order_item")(sequelize, Sequelize.DataTypes);
db.Notification = require("./notification")(sequelize, Sequelize.DataTypes);
db.PasswordResetToken = require("./password_reset_token")(
  sequelize,
  Sequelize.DataTypes,
);
db.EmailVerificationToken = require("./email_verification_token")(
  sequelize,
  Sequelize.DataTypes,
);
db.AuditLog = require("./audit_log")(sequelize, Sequelize.DataTypes);

// =============================================================================
// Associations - định nghĩa tập trung sau khi tất cả models đã load xong
// =============================================================================

// Role - User (1-n)
db.User.belongsTo(db.Role, { foreignKey: "role_id", as: "role" });
db.Role.hasMany(db.User, { foreignKey: "role_id" });

// User - Branch (n-n qua UserBranch)
db.User.belongsToMany(db.Branch, {
  through: db.UserBranch,
  foreignKey: "user_id",
  otherKey: "branch_id",
  as: "Branches",
});
db.Branch.belongsToMany(db.User, {
  through: db.UserBranch,
  foreignKey: "branch_id",
  otherKey: "user_id",
  as: "Users",
});

// Branch - Table (1-n)
db.Branch.hasMany(db.Table, { foreignKey: "branch_id", onDelete: "RESTRICT" });
db.Table.belongsTo(db.Branch, { foreignKey: "branch_id" });

// Branch - MenuCategory (1-n)
db.Branch.hasMany(db.MenuCategory, {
  foreignKey: "branch_id",
  onDelete: "CASCADE",
});
db.MenuCategory.belongsTo(db.Branch, { foreignKey: "branch_id" });

// Branch - MenuItem (1-n)
db.Branch.hasMany(db.MenuItem, {
  foreignKey: "branch_id",
  onDelete: "CASCADE",
});
db.MenuItem.belongsTo(db.Branch, { foreignKey: "branch_id" });

// MenuCategory - MenuItem (1-n)
db.MenuCategory.hasMany(db.MenuItem, {
  foreignKey: "category_id",
  onDelete: "CASCADE",
});
db.MenuItem.belongsTo(db.MenuCategory, { foreignKey: "category_id" });

// Branch - Notification (1-n)
db.Branch.hasMany(db.Notification, {
  foreignKey: "branch_id",
  onDelete: "CASCADE",
});
db.Notification.belongsTo(db.Branch, { foreignKey: "branch_id" });

// Order - OrderItem (1-n)
db.Order.hasMany(db.OrderItem, { foreignKey: "order_id", onDelete: "CASCADE" });
db.OrderItem.belongsTo(db.Order, { foreignKey: "order_id" });

// MenuItem - OrderItem (1-n)
db.MenuItem.hasMany(db.OrderItem, { foreignKey: "item_id" });
db.OrderItem.belongsTo(db.MenuItem, { foreignKey: "item_id" });

// User - Order (1-n)
db.User.hasMany(db.Order, { foreignKey: "user_id" });
db.Order.belongsTo(db.User, { foreignKey: "user_id" });

// Branch - Order (1-n)
db.Branch.hasMany(db.Order, { foreignKey: "branch_id" });
db.Order.belongsTo(db.Branch, { foreignKey: "branch_id" });

// Table - Order (1-n)
db.Table.hasMany(db.Order, { foreignKey: "table_id" });
db.Order.belongsTo(db.Table, { foreignKey: "table_id" });

// User - Notification (1-n)
db.User.hasMany(db.Notification, { foreignKey: "user_id" });
db.Notification.belongsTo(db.User, { foreignKey: "user_id" });

module.exports = db;
