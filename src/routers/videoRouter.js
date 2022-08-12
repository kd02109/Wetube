import express from "express";
import {
  watch,
  edit,
  removeVideo,
  upload,
  editTitle,
  saevUpload,
} from "../controller/videoController";

const videoRouter = express.Router();

videoRouter.get("/:id([a-f0-9]{24})", watch);
videoRouter.get("/:id([a-f0-9]{24})/remove", removeVideo);
videoRouter.route("/upload").get(upload).post(saevUpload);
videoRouter.route("/:id([a-f0-9]{24})/edit").get(edit).post(editTitle);
export default videoRouter;
