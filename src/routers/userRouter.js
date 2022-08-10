import express from "express";
import { join, delet, edit } from "../controller/userController";

const userRouter = express.Router();

userRouter.get("/edit", edit);
userRouter.get("/delet", delet);

export default userRouter;
