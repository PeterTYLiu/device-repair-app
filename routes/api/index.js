const path = require('path');
const router = require('express').Router();
const shopRoutes = require('./shops');
const customerRoutes = require('./customer');
const deviceRoutes = require('./device');
const supplierRoutes = require('./supplier');
const partRoutes = require('./parts');
const repairParts = require('./reapirs');

// Shop routes
router.use('/shops', shopRoutes);

//Customer routes
router.use('/customers', customerRoutes);

// Device routes
router.use('/devices', deviceRoutes);

// Supplier routes
router.use('/suppliers', supplierRoutes);

router.use('/parts', partRoutes);

// repair routes
router.use('/repairs', repairParts);

router.get('/logout', async function (req, res) {
  req.logOut();
  res.redirect('/');
});

// For anything else, render the html page
// router.use(function (req, res) {
//   res.sendFile(path.join(__dirname, '../'));
// });

module.exports = router;
