module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define(
    "OrderItem",
    {
      order_item_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      rid: { type: DataTypes.STRING(32), unique: true },
      order_id: { type: DataTypes.INTEGER, allowNull: false },
      item_id: { type: DataTypes.INTEGER, allowNull: false },
      quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
      note: { type: DataTypes.STRING(255), allowNull: true },
      price: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    },
    { tableName: "order_items", timestamps: false },
  );

  OrderItem.associate = (models) => {
    OrderItem.belongsTo(models.Order, { foreignKey: "order_id" });
    OrderItem.belongsTo(models.MenuItem, {
      foreignKey: "item_id",
      as: "menuItem",
    });
  };

  return OrderItem;
};
