import "./db";
import "./models/Video";
import app from "./server";

const PORT = 9000;

const handleListening = () =>
  console.log(`✅Server listening on port ${PORT} ❤️🚀`);

app.listen(PORT, handleListening);
