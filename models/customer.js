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

  return Customer;
};
