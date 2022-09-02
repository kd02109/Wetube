import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

const multerUploder = multerS3({
  s3: s3,
  bucket: "wetube3practice",
  acl: "public-read",
});

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
  storage: multerUploder,
});
export const multerMiddlewareVideo = multer({
  dest: "uploads/video/",
  limits: {
    fileSize: 10000000,
  },
  storage: multerUploder,
});
