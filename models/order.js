module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    "Order",
    {
      order_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      rid: { type: DataTypes.STRING(32), unique: true },
      table_id: { type: DataTypes.INTEGER, allowNull: false },
      order_status: { type: DataTypes.STRING(50), defaultValue: "pending" },
      order_time: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      order_message: { type: DataTypes.TEXT, allowNull: true },
      order_note: { type: DataTypes.TEXT, allowNull: true },
    },
    {
      tableName: "orders",
      timestamps: false,
    },
  );

  Order.associate = (models) => {
    Order.belongsTo(models.Table, { foreignKey: "table_id" });
    Order.hasMany(models.OrderItem, {
      foreignKey: "order_id",
      as: "OrderItems",
      onDelete: "CASCADE",
    });
    Order.hasMany(models.Notification, {
      foreignKey: "order_id",
      onDelete: "SET NULL",
    });
  };

  return Order;
};
