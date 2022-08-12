import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

console.log(process.cwd());
const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", "./src/views");
app.set("x-powered-by", "false");

app.use(logger);
app.use(express.urlencoded({ extended: true }));

app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;
