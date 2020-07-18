const deviceRouter = require('express').Router();
const device = require('../../controllers/deviceController');
const isShopAuthenticated = require('../../config/middleware/isAuthenticatedShop');

deviceRouter.use(isShopAuthenticated);

deviceRouter.post('/', device.create);

deviceRouter.get('/', device.find);

deviceRouter.get('/all', device.findAll);

module.exports = deviceRouter;
