module.exports = function (sequelize, DataTypes) {
  const Shop = sequelize.define('Shop', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    name: {
      //name of the shop
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isAlphanumeric: true,
        len: [4, 10],
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        // require one number and one special character at least and enforce
        is: ['^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$'],
      },
    },
    ownerName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2],
        isAlpha: true,
      },
    },
  });
  Shop.associate = function (models) {
    Shop.belongsToMany(models.Supplier, { through: 'ShopSuppliers' });
    Shop.hasMany(models.Repair, {
      as: 'repairs',
      foreignKey: {
        name: 'repairShopId',
        allowNull: false,
      },
    });
  };
  return Shop;
};
