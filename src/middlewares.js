export const localsMiddleware = (req, res, next) => {
  console.log(req.session);
  if (req.session.loggedIn) {
    res.locals.loggedIn = true;
    res.locals.user = req.session.user;
  }
  res.locals.siteName = "Wetube";
  next();
};
