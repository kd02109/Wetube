import express from "express";
import {
  watch,
  edit,
  deleteVideo,
  upload,
  editTitle,
  saevUpload,
} from "../controller/videoController";

const videoRouter = express.Router();

videoRouter.get("/:id([a-f0-9]{24})", watch);
videoRouter.route("/:id([a-f0-9]{24})/delet").get(deleteVideo);
videoRouter.route("/upload").get(upload).post(saevUpload);
videoRouter.route("/:id([a-f0-9]{24})/edit").get(edit).post(editTitle);
export default videoRouter;
