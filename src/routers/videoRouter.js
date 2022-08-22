import express from "express";
import {
  watch,
  edit,
  deleteVideo,
  upload,
  editTitle,
  saevUpload,
} from "../controller/videoController";
import { multerMiddlewareVideo, protectMiddleware } from "../middlewares";

const videoRouter = express.Router();

videoRouter.get("/:id([a-f0-9]{24})", watch);
videoRouter
  .route("/:id([a-f0-9]{24})/delet")
  .all(protectMiddleware)
  .get(deleteVideo);
videoRouter
  .route("/upload")
  .all(protectMiddleware)
  .get(upload)
  .post(multerMiddlewareVideo.single("video"), saevUpload);
videoRouter
  .route("/:id([a-f0-9]{24})/edit")
  .all(protectMiddleware)
  .get(edit)
  .post(editTitle);
export default videoRouter;
