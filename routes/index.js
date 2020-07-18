const path = require('path');
const mainRouter = require('express').Router();
const apiRoutes = require('./api');
// This is the main route controller

// API Routes
mainRouter.use('/api', apiRoutes);

// If no API routes are hit, send the React app
// mainRouter.use((req, res) =>
//   res.sendFile(path.join(__dirname, '../client/build/index.html'))
// );

module.exports = mainRouter;
