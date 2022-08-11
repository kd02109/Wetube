import express from "express";
import * as userController from "../controller/userController";
import { homepage, search } from "../controller/videoController";

const globalRouter = express.Router();

globalRouter.get("/", homepage);
globalRouter.get("/join", userController.join);
globalRouter.get("/login", userController.login);
globalRouter.get("/logout", userController.logout);
globalRouter.get("/search", search);

export default globalRouter;
