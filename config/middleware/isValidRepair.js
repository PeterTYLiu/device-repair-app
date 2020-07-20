const { Repair } = require('../../models');
// This is middleware for checking if a repair exist with given repairid.
module.exports = async function (req, res, next) {
  const repairId = req.params.repairId;
  const repair = await Repair.findByPk(repairId);
  if (!repair) {
    res.setHeader(('X-Status-Reason', `No repair found with id: ${repairId}`));
    res.sendStatus(409);
    return;
  }
  req.params.repair = repair;
  // If valid repair then follow the chain
  return next();
};
