const deviceRouter = require('express').Router();
const device = require('../../controllers/deviceController');
const isShopAuthenticated = require('../../config/middleware/isAuthenticatedShop');

deviceRouter.use(isShopAuthenticated);

deviceRouter.post('/', device.create);

deviceRouter.get('/:deviceId', device.find);

deviceRouter.get('/', device.findAll);

deviceRouter.get('/manufacturers/all', device.findAllManufacturers);

deviceRouter.post('/manufacturers', device.createManufacturer);

module.exports = deviceRouter;
