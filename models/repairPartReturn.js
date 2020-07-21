module.exports = function (sequelize, DataTypes) {
  const RepairPartReturn = sequelize.define('RepairPartReturn', {
    comeBackDate: {
      /** This is the date a particular part for a paricular repair comes back for repair again */
      type: DataTypes.DATEONLY,
      allowNull: true,
      validate: {
        isDate: true,
      },
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

  RepairPartReturn.associate = function (models) {
    // RepairParts.belongsTo(models.Shop);
    RepairPartReturn.belongsTo(models.RepairParts, {
      foreignKey: {
        name: 'RepairPartId',
        allowNull: false,
        onDelete: 'CASCADE',
      },
    });
  };

  return RepairPartReturn;
};
