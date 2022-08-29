import multer from "multer";

export const localsMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    res.locals.loggedIn = true;
    res.locals.user = req.session.user;
  } else {
    res.locals.user = {};
  }
  res.locals.siteName = "Wetube";
  next();
};

export const protectMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    req.flash("error", "Not authorized");
    return res.redirect("/login");
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Not authorized");
    return res.redirect("/");
  }
};

export const passwordUsersOnlyMiddleware = (req, res, next) => {
  if (req.session.user.socialOnly === true) {
    req.flash("error", "Not authorized");
    return res.redirect("/");
  } else {
    return next();
  }
};

export const multerMiddlewareAvatar = multer({
  dest: "uploads/avatar/",
  limits: {
    fileSize: 3000000,
  },
});
export const multerMiddlewareVideo = multer({
  dest: "uploads/video/",
  limits: {
    fileSize: 10000000,
  },
});
