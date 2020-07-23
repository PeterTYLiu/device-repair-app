module.exports = function (sequelize, DataTypes) {
  const Manufacturer = sequelize.define('Manufacturer', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return Manufacturer;
};
