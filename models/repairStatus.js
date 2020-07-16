module.exports = function (sequelize, DataTypes) {
  const RepaiStatus = sequelize.define('RepairStatus', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isIn: [['Ongoing', 'Completed', 'Delivered']],
      },
    },
  });
  return RepaiStatus;
};
