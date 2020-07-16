module.exports = function (sequelize, DataTypes) {
  const RepairParts = sequelize.define('RepairParts', {
    comeBackDate: {
      /** This is the date a particular part for a paricular repair comes back for repair again */
      type: DataTypes.DATEONLY,
      allowNull: true,
      validate: {
        isDate: true,
      },
    },
  });
  return RepairParts;
};
