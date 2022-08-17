import express from "express";
import {
  profile,
  edit,
  logout,
  startGithubLogin,
  finishGithubLogin,
  kakaoLoginStart,
  kakaoLoginFinish,
} from "../controller/userController";

const userRouter = express.Router();

userRouter.get("/edit", edit);
userRouter.get("/logout", logout);
userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);
userRouter.get(":id", profile);
userRouter.get("/kakao/start", kakaoLoginStart);
userRouter.get("/kakao/finish", kakaoLoginFinish);
export default userRouter;
