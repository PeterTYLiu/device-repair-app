var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var db = require('../models');

// Telling passport we want to use a Local Strategy. In other words, we want login with a username/email and password
passport.use(
  'cutomer-local',
  new LocalStrategy(
    // Our user will sign in using an email, rather than a "username"
    {
      usernameField: 'email',
    },
    function (email, password, done) {
      // When a user tries to sign in this code runs
      console.log('using cusromer-local');
      db.Customer.findOne({
        where: {
          email: email,
        },
      }).then(function (dbCustomer) {
        // If there's no user with the given email
        if (!dbCustomer) {
          return done(null, false, {
            message: 'Incorrect email.',
          });
        }
        // If there is a user with the given email, but the password the user gives us is incorrect
        else if (!dbCustomer.validPassword(password)) {
          return done(null, false, {
            message: 'Incorrect password.',
          });
        }
        dbCustomer.isCustomer = true;
        // If none of the above, return the user
        return done(null, dbCustomer);
      });
    }
  )
);

passport.use(
  'shop-local',
  new LocalStrategy(
    // Our user will sign in using an email, rather than a "username"
    {
      usernameField: 'email',
    },
    function (email, password, done) {
      // When a user tries to sign in this code runs
      db.Shop.findOne({
        where: {
          email: email,
        },
      }).then(function (dbShop) {
        // If there's no user with the given email
        if (!dbShop) {
          return done(null, false, {
            message: 'Incorrect email.',
          });
        }
        // If there is a user with the given email, but the password the user gives us is incorrect
        else if (!dbShop.validPassword(password)) {
          return done(null, false, {
            message: 'Incorrect password.',
          });
        }
        // console.log('dbshop: ' + dbShop.isShop());
        // If none of the above, return the user
        return done(null, dbShop);
      });
    }
  )
);

// In order to help keep authentication state across HTTP requests,
// Sequelize needs to serialize and deserialize the user
// Just consider this part boilerplate needed to make it all work
passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
  console.log('Obj :' + JSON.stringify(obj));
});

// Exporting our configured passport
module.exports = passport;
