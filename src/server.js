import express from "express";

const PORT = 9000;
const app = express();
const gossipMiddleware = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};
const protectionMiddleware = (req, res, next) => {
  const url = req.url;
  if (url === "/protected") {
    return res.send("<h1>Not Allowed</h1>");
  }
  console.log("Allowed");
  next();
};
function handleHmoe(req, res) {
  return res.end();
}
function handleProtected(req, res) {
  return res.send("Welcome to the private lounage");
}
app.use(gossipMiddleware, protectionMiddleware);
app.get("/", handleHmoe);
app.get("/login", (req, res) => {
  return res.send("This is a login page!");
});
app.get("/protected", handleProtected);

const handleListening = () =>
  console.log(`✅Server listening on port ${PORT} ❤️🚀`);

app.listen(PORT, handleListening);
