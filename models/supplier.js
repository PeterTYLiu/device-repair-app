module.exports = function (sequelize, DataTypes) {
  const Supplier = sequelize.define('Supplier', {
    organization: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3],
      },
    },
  });

  Supplier.associate = function (models) {
    Supplier.belongsToMany(models.Shop, { through: 'ShopSuppliers' });
  };

  return Supplier;
};
