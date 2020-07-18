const supplierRouter = require('express').Router();
const suppliers = require('../../controllers/supplierController');
const isShopAuthenticated = require('../../config/middleware/isAuthenticatedShop');

supplierRouter.use(isShopAuthenticated);

supplierRouter.post('/', suppliers.create);

// Returns All the suppliers

supplierRouter.get('/all', suppliers.findAll);

// Returns suppliers for currently signed in shop
supplierRouter.get('/', suppliers.findByShop);

supplierRouter.get('/:id', suppliers.find);

module.exports = supplierRouter;
