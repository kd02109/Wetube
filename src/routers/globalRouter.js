import express from "express";
import * as userController from "../controller/userController";
import { homepage, search } from "../controller/videoController";

const globalRouter = express.Router();

globalRouter.get("/", homepage);
globalRouter
  .route("/join")
  .get(userController.join)
  .post(userController.uploadJoin);
globalRouter
  .route("/login")
  .get(userController.login)
  .post(userController.postLogin);
globalRouter.get("/logout", userController.logout);
globalRouter.get("/search", search);

export default globalRouter;
