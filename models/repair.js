const repairStatus = require('./repairStatus');

module.exports = function (sequelize, DataTypes) {
  const Repair = sequelize.define('Repair', {
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: true,
      },
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      validate: {
        isDate: true,
      },
    },
    totalPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.0,
      validate: {
        isFloat: true,
      },
    },
    laborCost: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.0,
      validate: {
        isFloat: true,
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });
  Repair.associate = (models) => {
    Repair.belongsTo(models.Shop, {
      as: 'repairShop',
      foreignKey: {
        name: 'repairShopId',
        allowNull: false,
      },
    });
    Repair.hasOne(models.RepairStatus, {
      as: 'rapirStaus',
      foreignKey: {
        allowNull: false,
      },
    });
    Repair.hasOne(models.Warranty, {
      as: 'rapairWarranty',
      foreignKey: {
        allowNull: true, // a rapair is not required to have a warranty
        onDelete: 'CASCADE',
      },
    });
    Repair.belongsToMany(models.Part, { through: 'RepairParts' });
    Repair.belongsTo(models.Customer, {
      as: 'repairCustomer',
      foreignKey: {
        name: 'repairCustomerId',
        allowNull: false,
        onDelete: 'CASCADE',
      },
    });
  };

  return Repair;
};
