const shopRouter = require('express').Router();
const passport = require('passport');
const shops = require('../../controllers/shopController');
const isShopAuthenticated = require('../../config/middleware/isAuthenticatedShop');

shopRouter.post('/login', passport.authenticate('shop-local'), function (
  req,
  res
) {
  res.json(req.user);
});

shopRouter.post('/signup', shops.create);

shopRouter.get('/', isShopAuthenticated, shops.findShop);

module.exports = shopRouter;
