const { Sequelize } = require('.');

module.exports = function (sequelize, DataTypes) {
  const Warranty = sequelize.define('Warranty', {
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
      allowNull: false,
      validate: {
        isDate: true,
      },
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.0,
      validate: {
        isFloat: true,
      },
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'None',
      validate: {
        isIn: [['Valid', 'Expired']],
      },
    },
  });

  // Define Associations here
  // A warranty also belongs to a shop (So we can query warranty given by a shop directly)
  Warranty.associate = function (models) {
    Warranty.belongsTo(models.Shop, {
      as: 'warrantyShop',
      foreignKey: {
        allowNull: false,
      },
    });
    Warranty.belongsTo(models.Repair, {
      as: 'rapairWarranty',
      foreignKey: {
        allowNull: true, // a rapair is not required to have a warranty
        onDelete: 'CASCADE',
      },
    });
  };

  return Warranty;
};
