const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3001;
const db = require('./models');
const app = express();
const session = require('express-session');
const passport = require('./config/passport');
const mainRouter = require('./routes');

// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

// define authentication and session handler
// We need to use sessions to keep track of our user's login status
app.use(
  session({ secret: 'keyboard cat', resave: true, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());

// Define API routes here
app.use(mainRouter);

// // Send every other request to the React app
// // Define any API routes before this runs
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './client/build/index.html'));
});

db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0').then(() => {
  db.sequelize.sync().then(() => {
    // { force: true }
    db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0').then(() => {
      const PORT = process.env.PORT || 3001;
      app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
    });
  });
});
