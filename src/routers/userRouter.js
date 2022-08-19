import express from "express";
import {
  profile,
  getEdit,
  postEdit,
  startGithubLogin,
  finishGithubLogin,
  kakaoLoginStart,
  kakaoLoginFinish,
  getChangePassword,
  postChangePassword,
} from "../controller/userController";
import {
  multerMiddleware,
  passwordUsersOnlyMiddleware,
  protectMiddleware,
  publicOnlyMiddleware,
} from "../middlewares";

const userRouter = express.Router();

userRouter
  .route("/edit")
  .all(protectMiddleware)
  .get(getEdit)
  .post(multerMiddleware.single("avatar"), postEdit);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter.get(":id", profile);
userRouter.get("/kakao/start", publicOnlyMiddleware, kakaoLoginStart);
userRouter.get("/kakao/finish", publicOnlyMiddleware, kakaoLoginFinish);
userRouter
  .route("/change-password")
  .all(passwordUsersOnlyMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);
export default userRouter;
