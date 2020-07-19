module.exports = function (sequelize, DataTypes) {
  const RepairParts = sequelize.define('RepairParts', {
    repairPartId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    replaced: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
    },
  });

  RepairParts.associate = function (models) {
    // RepairParts.belongsTo(models.Shop);
    RepairParts.hasMany(models.RepairPartReturn);
  };
  return RepairParts;
};
