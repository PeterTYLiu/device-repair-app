module.exports = function (sequelize, DataTypes) {
  const Part = sequelize.define('Part', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1],
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
      validate: {
        isNumeric: true,
      },
    },
    supplierName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2],
      },
    },
  });

  // Define Associations here
  // A part belongs to a device
  Part.associate = function (models) {
    Part.belongsTo(models.Device, {
      foreignKey: {
        allowNull: false,
      },
    });
    Part.belongsToMany(models.Repair, { through: 'RepairParts' });
    Part.belongsTo(models.Supplier, {
      foreignKey: {
        allowNull: true,
      },
    });
    Part.belongsTo(models.Shop);
  };

  return Part;
};
