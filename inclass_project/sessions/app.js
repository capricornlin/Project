require("dotenv").config();
const { monkeyPatch } = require("abbrev");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const bodyParser = require("body-parser");
const User = require("./models/user");

app.set("view engine", "ejs");
// middlewares
app.use(express.static("public"));
app.use(cookieParser("thisiscookies")); //string不一樣 簽名就會不一樣
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect("mongodb://localhost:27017/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to mongodb.");
  })
  .catch((e) => {
    console.log(e);
  });

app.get("/", (req, res) => {
  res.send("Home page");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", (req, res, next) => {
  let { username, password } = req.body;
  let newUser = new User({ username, password });
  try {
    newUser
      .save()
      .then(() => {
        res.send("Data has been saved.");
      })
      .catch((e) => {
        res.send("Error");
      });
  } catch (err) {
    next(err);
  }
});

app.get("/*", (req, res) => {
  res.status(404).send("404 page not found.");
});

//error handler
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Something is broken");
});

app.listen(3000, () => {
  console.log("Server running on port 3000.");
});
