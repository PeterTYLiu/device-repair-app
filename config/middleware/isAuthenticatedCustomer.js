// This is middleware for restricting routes a user is not allowed to visit if not logged in
module.exports = function (req, res, next) {
  // If the shop is logged in, continue with the request to the restricted route
  if (req.user.id && !req.user.hasOwnProperty('ownerName')) {
    return next();
  }

  // If the user isn't logged in, redirect them to the login page
  return res.redirect('/');
};
