import express from "express";

const PORT = 9000;
const app = express();

app.get("/", (req, res) => {
  return res.send("I still miss you");
});
app.get("/login", (req, res) => {
  return res.send("This is a login page!");
});

const handleListening = () =>
  console.log(`✅Server listening on port ${PORT} ❤️🚀`);

app.listen(PORT, handleListening);
