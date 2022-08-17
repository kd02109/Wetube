import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;
const connectCheck = () => console.log("✅Connected to DB");
const errorCheck = (error) => console.log("🥸DB Error: ", error);

db.on("error", errorCheck);
//on은 여러번 발생 할 수 있다. 이를 통해 오류를 확인.
db.once("open", connectCheck);
//once는 한번만 발생한다.
