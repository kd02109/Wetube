import express from "express";
import {
  registerView,
  createComment,
  dleletComment,
} from "../controller/videoController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([a-f0-9]{24})/view", registerView);
apiRouter.post("/videos/:id([a-f0-9]{24})/comment", createComment);
apiRouter.post("/videos/:id([a-f0-9]{24})/comment-delet", dleletComment);

export default apiRouter;
