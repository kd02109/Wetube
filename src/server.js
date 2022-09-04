import express from "express";
import flash from "express-flash";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import session from "express-session";
import { localsMiddleware } from "./middlewares";
import MongoStore from "connect-mongo";
import apiRouter from "./routers/apiRouter";

console.log(process.cwd());
const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", "./src/views");
app.set("x-powered-by", "false");

app.use(logger);
//input tag 의 value를 받아올수 있게한다.
app.use(express.urlencoded({ extended: true }));
//브라우저에서 작성된 text를 이해할 수 있게 한다.
//app.use(express.text());
//json을 통해 스트링으로 받은 것을 다시 json 파일로 변경해준다.
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);
app.use((req, res, next) => {
  res.header("Cross-Origin-Embedder-Policy", "require-corp");
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  next();
});

app.use(flash());
app.use(localsMiddleware);
app.use("/uploads", express.static("uploads"));
app.use("/assets", express.static("assets"));
app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/api", apiRouter);
export default app;
