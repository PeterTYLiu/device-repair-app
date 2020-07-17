const customerRouter = require('express').Router();
const passport = require('passport');
const customer = require('../../controllers/customerController');
const isShopAuthenticated = require('../../config/middleware/isAuthenticatedCustomer');

customerRouter.post('/login', passport.authenticate('cutomer-local'), function (
  req,
  res
) {
  res.json(req.user);
});

customerRouter.post('/signup', customer.create);

customerRouter.get('/', isShopAuthenticated, customer.find);

module.exports = customerRouter;
