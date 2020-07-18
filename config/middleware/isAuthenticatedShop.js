// This is middleware for restricting routes a user is not allowed to visit if not logged in
module.exports = function (req, res, next) {
  // If the shop is logged in, continue with the request to the restricted route
  if (req.user && req.user.hasOwnProperty('ownerName') && req.user.id) {
    console.log('shop is authenticated.');
    return next();
  }

  // If the user isn't logged in, redirect them to the login page
  return res.redirect('/');
};
