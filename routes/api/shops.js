const shopRouter = require('express').Router();
const shops = require('../../controllers/shopController');

shopRouter.post('/', shops.create);

shopRouter.get('/:id', shops.findShop);

module.exports = shopRouter;
