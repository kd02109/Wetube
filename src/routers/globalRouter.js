import express from "express";
import { join } from "../controller/userController";
import { homepage } from "../controller/videoController";

const globalRouter = express.Router();

globalRouter.get("/", homepage);
globalRouter.get("/join", join);

export default globalRouter;
