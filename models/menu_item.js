module.exports = (sequelize, DataTypes) => {
  const MenuItem = sequelize.define(
    "MenuItem",
    {
      item_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      rid: { type: DataTypes.STRING(32), unique: true },
      category_id: { type: DataTypes.INTEGER, allowNull: true },
      branch_id: { type: DataTypes.INTEGER, allowNull: false },
      item_name: { type: DataTypes.STRING(60), allowNull: false },
      item_description: { type: DataTypes.STRING(255) },
      item_image: { type: DataTypes.STRING(255) },
      is_disable: { type: DataTypes.BOOLEAN, defaultValue: false },
      price: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
      is_delete: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    { tableName: "menu_items", timestamps: false },
  );

  MenuItem.associate = (models) => {
    MenuItem.belongsTo(models.MenuCategory, {
      foreignKey: "category_id",
      onDelete: "RESTRICT",
    });
    MenuItem.belongsTo(models.Branch, {
      foreignKey: "branch_id",
      onDelete: "CASCADE",
    });
    MenuItem.hasMany(models.OrderItem, {
      foreignKey: "item_id",
      as: "orderItems",
      onDelete: "RESTRICT",
    });
  };

  return MenuItem;
};
