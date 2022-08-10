import express from "express";
import { homepage, edit } from "../controller/videoController";

const videoRouter = express.Router();

videoRouter.get("/watch", homepage);
videoRouter.get("/edit", edit);

export default videoRouter;
