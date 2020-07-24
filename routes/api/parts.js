const partsRouter = require('express').Router();
const parts = require('../../controllers/partControllers');
const isShopAuthenticated = require('../../config/middleware/isAuthenticatedShop');

partsRouter.use(isShopAuthenticated);

partsRouter.post('/', parts.create);

// Returns All the parts for current shop
partsRouter.get('/', parts.findAll);

// Returns All the parts for current shop and a particular DEVICE
partsRouter.get('/device/:id', parts.findByDevice);

partsRouter.get('/device/:id/partnames', parts.findPartNamesForDevice);

partsRouter.get('/:id', parts.find);

partsRouter.get('/:id/stats', parts.getStats);

module.exports = partsRouter;
