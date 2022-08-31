import express from "express";
import {
  registerView,
  createComment,
  deleteComment,
} from "../controller/videoController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([a-f0-9]{24})/view", registerView);
apiRouter.post("/videos/:id([a-f0-9]{24})/comment", createComment);
apiRouter.post("/videos/:id([a-f0-9]{24})/delete", deleteComment);

export default apiRouter;
