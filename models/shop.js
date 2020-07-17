const bcrypt = require('bcryptjs');

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

  Shop.prototype.isShop = function () {
    return true;
  };

  // Creating a custom method for our User model. This will check if an unhashed password entered by the user can be compared to the hashed password stored in our database
  Shop.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  };
  // Hooks are automatic methods that run during various phases of the User Model lifecycle
  // In this case, before a User is created, we will automatically hash their password
  Shop.addHook('beforeCreate', function (shop) {
    shop.password = bcrypt.hashSync(
      shop.password,
      bcrypt.genSaltSync(10),
      null
    );
  });

  return Shop;
};
