module.exports = function (sequelize, DataTypes) {
  const ShopSuppliers = sequelize.define('ShopSuppliers');

  ShopSuppliers.associate = function (models) {
    ShopSuppliers.belongsTo(models.Shop);
    ShopSuppliers.belongsTo(models.Supplier);
  };
  return ShopSuppliers;
};
