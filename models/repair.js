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
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
      validate: {
        isDecimal: true,
        min: 0.0,
      },
    },
    laborCost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
      validate: {
        isDecimal: true,
        min: 0.0,
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Ongoing',
      validate: {
        isIn: [['Ongoing', 'Completed', 'Delivered']],
      },
    },
  });
  Repair.associate = (models) => {
    Repair.belongsTo(models.Shop, {
      // as: 'repairShop',
      foreignKey: {
        name: 'repairShopId',
        allowNull: false,
      },
    });
    // Repair.hasOne(models.RepairStatus, {
    //   as: 'repairStaus',
    //   foreignKey: {
    //     allowNull: false,
    //   },
    // });
    Repair.hasOne(models.Warranty, {
      // as: 'rapairWarranty',
      foreignKey: {
        allowNull: false, // foreign key will be in warranty table. A warranty may not exist without a repair.
        onDelete: 'CASCADE',
      },
    });
    Repair.belongsTo(models.Device);
    Repair.belongsToMany(models.Part, { through: 'RepairParts' });
    Repair.belongsTo(models.Customer, {
      // as: 'repairCustomer',
      foreignKey: {
        name: 'repairCustomerId',
        allowNull: false,
        onDelete: 'CASCADE',
      },
    });
  };

  return Repair;
};
