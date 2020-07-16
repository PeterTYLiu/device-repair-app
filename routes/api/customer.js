const customerRouter = require('express').Router();
const customer = require('../../controllers/customerController');

customerRouter.post('/', customer.create);

customerRouter.get('/:id', customer.findCustomer);

module.exports = customerRouter;
