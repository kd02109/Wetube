import express from "express";
import {
  watch,
  edit,
  removeVideo,
  upload,
  editTitle,
} from "../controller/videoController";

const videoRouter = express.Router();

videoRouter.get("/:id(\\d+)", watch);
videoRouter.get("/:id(\\d+)/remove", removeVideo);
videoRouter.get("/upload", upload);
videoRouter.route("/:id(\\d+)/edit").get(edit).post(editTitle);
export default videoRouter;
