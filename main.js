const express = require("express");
const morgan = require("morgan");
const todos = require("./handlers/todos");
const auth = require("./handlers/auth");
const avatars = require("./handlers/avatars");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const fs = require("fs");
require("dotenv").config();
mongoose.connect(
  `mongodb+srv://backend:${process.env.DB_PASS}@cluster0.moxqa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  }
);

if (!fs.existsSync("avatars")) {
  fs.mkdirSync("avatars");
}

const app = express();

app.use(express.json());
app.use(morgan("common"));
app.use(require("cors")());

// Check if user provided a token and verify it
app.use((req, res, next) => {
  let token = req.header("Authorization");
  if (!token) {
    next();
    return;
  }
  // Token pattern should be "Bearer TOKEN" so we take only a token part
  token = token.split(" ")[1];
  jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (!err) {
      req.user = decoded;
    }
    next();
  });
});

app.use("/avatar", express.static("avatars"));
app.use("/todos", todos);
app.use("/auth", auth);
app.use("/avatars", avatars);

app.get("/", (req, res) => {
  let user;
  if (req.user) user = req.user;
  res.send({ message: "Hello World", user, status: 200 });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
