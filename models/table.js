// models/table.js
module.exports = (sequelize, DataTypes) => {
  const Table = sequelize.define(
    "Table",
    {
      table_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      rid: { type: DataTypes.STRING(32), unique: true },
      table_name: { type: DataTypes.STRING(60), allowNull: false },
      description: { type: DataTypes.STRING(255) },
      branch_id: { type: DataTypes.INTEGER, allowNull: false },
      capacity: { type: DataTypes.INTEGER, defaultValue: 0 },
      status: {
        type: DataTypes.ENUM("available", "occupied", "reserved"),
        defaultValue: "available",
      },
      is_delete: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    { tableName: "tables", timestamps: false },
  );

  Table.associate = (models) => {
    Table.belongsTo(models.Branch, {
      foreignKey: "branch_id",
      onDelete: "RESTRICT",
    });
    Table.hasMany(models.Order, {
      foreignKey: "table_id",
      onDelete: "RESTRICT",
    });
  };

  return Table;
};
