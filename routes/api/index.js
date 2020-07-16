const path = require('path');
const router = require('express').Router();
const shopRoutes = require('./shops');
const customerRoutes = require('./customer');
const deviceRoutes = require('./device');

// Shop routes
router.use('/shops', shopRoutes);

//Customer routes
router.use('/customers', customerRoutes);

// Device routes
router.use('/devices', deviceRoutes);

// For anything else, render the html page
router.use(function (req, res) {
  res.sendFile(path.join(__dirname, '../../client/build/index.html'));
});

module.exports = router;
