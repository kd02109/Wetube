import express from "express";
import { profile, remove, edit, logout } from "../controller/userController";

const userRouter = express.Router();

userRouter.get("/edit", edit);
userRouter.get("/delet", remove);
userRouter.get("/logout", logout);
userRouter.get(":id", profile);

export default userRouter;
