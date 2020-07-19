module.exports = function (sequelize, DataTypes) {
  const repairPartReturn = sequelize.define('RepairPartReturn', {
    comeBackDate: {
      /** This is the date a particular part for a paricular repair comes back for repair again */
      type: DataTypes.DATEONLY,
      allowNull: true,
      validate: {
        isDate: true,
      },
    },
  });

  return repairPartReturn;
};
