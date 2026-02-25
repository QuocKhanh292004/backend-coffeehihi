module.exports = (sequelize, DataTypes) => {
  const Branch = sequelize.define(
    "Branch",
    {
      branch_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      rid: {
        type: DataTypes.STRING(32),
        unique: true,
      },
      branch_name: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(255),
      },
      branch_image: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      is_delete: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "branches",
      timestamps: false,
    },
  );

  // ✅ Associations được định nghĩa tập trung trong models/index.js
  // Không định nghĩa ở đây để tránh duplicate

  return Branch;
};
