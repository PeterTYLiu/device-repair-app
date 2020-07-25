const customerRouter = require('express').Router();
const passport = require('passport');
const customer = require('../../controllers/customerController');
const isCustomerAuthenticated = require('../../config/middleware/isAuthenticatedCustomer');
const isShopAuthenticated = require('../../config/middleware/isAuthenticatedShop');

customerRouter.post('/login', passport.authenticate('cutomer-local'), function (
  req,
  res
) {
  res.json(req.user);
});

customerRouter.post('/signup', isShopAuthenticated, customer.create);

customerRouter.get('/', isCustomerAuthenticated, customer.find);

customerRouter.get('/repairs', isCustomerAuthenticated, customer.getAllRepairs);

module.exports = customerRouter;
