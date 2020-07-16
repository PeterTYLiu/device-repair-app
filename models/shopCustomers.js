module.exports = function (sequelize, DataTypes) {
  const ShopCustomers = sequelize.define('ShopCustomers', {
    lastWalkInDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
      },
    },
  });
  return ShopCustomers;
};
