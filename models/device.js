module.exports = function (sequelize, DataTypes) {
  const Device = sequelize.define('Device', {
    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Device.associate = function (models) {
    Device.belongsTo(models.Manufacturer, {
      foreignKey: {
        allowNull: false,
      },
    });
  };
  return Device;
};
