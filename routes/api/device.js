const deviceRouter = require('express').Router();
const device = require('../../controllers/deviceController');

deviceRouter.post('/', device.create);

deviceRouter.get('/:id', device.find);

module.exports = deviceRouter;
