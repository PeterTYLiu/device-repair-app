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
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        isInt: true,
        isPositiveInt: function (value) {
          if (value < 1) {
            throw new Error('Part quantity can not less than one.');
          }
        },
      },
    },
  });

  RepairParts.associate = function (models) {
    // RepairParts.belongsTo(models.Shop);
    RepairParts.hasMany(models.RepairPartReturn, {
      foreignKey: {
        name: 'RepairPartId',
        allowNull: false,
        onDelete: 'CASCADE',
      },
    });
  };
  return RepairParts;
};
