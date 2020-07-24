const repairsRouter = require('express').Router();
const repairs = require('../../controllers/repairController');
const warranties = require('../../controllers/warrantyController');
const isShopAuthenticated = require('../../config/middleware/isAuthenticatedShop');
const isValidRepair = require('../../config/middleware/isValidRepair');

repairsRouter.use(isShopAuthenticated);

repairsRouter.post('/', repairs.create);

// Returns suppliers for currently signed in shop
repairsRouter.get('/', repairs.findByShop);

repairsRouter.get('/customer/:customerId', repairs.findByCustomer);

repairsRouter.get('/:id', repairs.find);

repairsRouter.post(
  '/:repairId/addPart/:partId/',
  isValidRepair,
  repairs.addPart
);

repairsRouter.post(
  '/:repairId/removePart/:partId',
  isValidRepair,
  repairs.removePart
);

repairsRouter.patch('/:repairId/updateCost', isValidRepair, repairs.updateCost);

repairsRouter.patch(
  '/:repairId/updateNotes',
  isValidRepair,
  repairs.updateNotes
);

repairsRouter.patch(
  '/:repairId/updateStatus',
  isValidRepair,
  repairs.updateStatus
);

repairsRouter.put('/:id', repairs.update); // This is for complete replacement of the repair

// warranty routes
// Add a warranty to a repair
repairsRouter.post('/:repairId/addWarranty', isValidRepair, warranties.create);

// claim warranty
repairsRouter.patch(
  '/:repairId/claimWarranty',
  isValidRepair,
  repairs.claimWarranty
);

module.exports = repairsRouter;
