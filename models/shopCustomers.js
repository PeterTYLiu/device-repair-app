module.exports = function (sequelize, DataTypes) {
  const ShopCustomers = sequelize.define('ShopCustomers', {
    lastWalkInDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: true,
      },
    },
  });
  return ShopCustomers;
};
