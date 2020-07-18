const partsRouter = require('express').Router();
const parts = require('../../controllers/partControllers');
const isShopAuthenticated = require('../../config/middleware/isAuthenticatedShop');

partsRouter.use(isShopAuthenticated);

partsRouter.post('/', parts.create);

// Returns All the parts for current shop
partsRouter.get('/all', parts.findAll);

// Returns All the parts for current shop and a particular DEVICE
partsRouter.get('/device/:id', parts.findByDevice);

partsRouter.get('/:id', parts.find);

module.exports = partsRouter;
