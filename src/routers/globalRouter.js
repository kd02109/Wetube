import express from "express";
import * as userController from "../controller/userController";
import { homepage, search } from "../controller/videoController";
import { protectMiddleware, publicOnlyMiddleware } from "../middlewares";

const globalRouter = express.Router();

globalRouter.get("/", homepage);
globalRouter
  .route("/join")
  .all(publicOnlyMiddleware)
  .get(userController.join)
  .post(userController.uploadJoin);
globalRouter
  .route("/login")
  .all(publicOnlyMiddleware)
  .get(userController.login)
  .post(userController.postLogin);
globalRouter.get("/logout", protectMiddleware, userController.logout);
globalRouter.get("/search", search);

export default globalRouter;
