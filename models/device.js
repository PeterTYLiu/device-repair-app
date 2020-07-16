module.exports = function (sequelize, DataTypes) {
  const Device = sequelize.define('Device', {
    manufacturer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return Device;
};
