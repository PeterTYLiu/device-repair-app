const repairsRouter = require('express').Router();
const repairs = require('../../controllers/repairController');
const isShopAuthenticated = require('../../config/middleware/isAuthenticatedShop');

repairsRouter.use(isShopAuthenticated);

repairsRouter.post('/', repairs.create);

// Returns suppliers for currently signed in shop
repairsRouter.get('/', repairs.findByShop);

repairsRouter.get('/:id', repairs.find);

repairsRouter.post('/:repairId/:partId/add', repairs.addPart);

repairsRouter.post('/:repairId/:partId/remove', repairs.removePart);

repairsRouter.patch('/:repairId/updateCost', repairs.updateCost);

repairsRouter.patch('/:repairId/updateNotes', repairs.updateNotes);

repairsRouter.put('/:id', repairs.update); // This is for complete replacement of the repair

module.exports = repairsRouter;
