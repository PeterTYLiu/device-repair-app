const bcrypt = require('bcryptjs');

module.exports = function (sequelize, DataTypes) {
  const Customer = sequelize.define('Customer', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isAlphanumeric: true,
        len: [3],
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
  });
  Customer.associate = function (models) {
    Customer.belongsToMany(models.Shop, { through: 'ShopCustomers' });
    Customer.hasMany(models.Repair, {
      as: 'repairs',
      foreignKey: {
        name: 'repairCustomerId',
        allowNull: false,
        onDelete: 'CASCADE',
      },
    });
  };

  // Creating a custom method for our User model. This will check if an unhashed password entered by the user can be compared to the hashed password stored in our database
  Customer.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  };
  // Hooks are automatic methods that run during various phases of the User Model lifecycle
  // In this case, before a User is created, we will automatically hash their password
  Customer.addHook('beforeCreate', function (customer) {
    customer.password = bcrypt.hashSync(
      customer.password,
      bcrypt.genSaltSync(10),
      null
    );
  });

  return Customer;
};
