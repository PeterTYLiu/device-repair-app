module.exports = function (sequelize, DataTypes) {
  const Part = sequelize.define('Part', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1],
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
    Part.belongsTo(models.Supplier);
    Part.belongsTo(models.Shop);
  };

  return Part;
};
