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
const bcrypt = require("bcrypt");
const saltRounds = 10;

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

//middLeware
const requireLogin = (req, res, next) => {
  if (!req.session.isVerfied == true) {
    res.redirect("login");
  } else {
    next();
  }
};

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

app.get("/secret", requireLogin, (req, res) => {
  res.render("secret");
});

app.get("/", (req, res) => {
  res.send("Home page");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res, next) => {
  let { username, password } = req.body;
  try {
    let foundUser = await User.findOne({ username });
    if (foundUser) {
      bcrypt.compare(password, foundUser.password, (err, result) => {
        if (err) {
          next(err);
        }
        if (result == true) {
          req.session.isVerfied = true;
          res.redirect("secret");
        } else {
          res.send("Username or password not correct.");
        }
      });
    } else {
      res.send("Username or password not correct.");
    }
  } catch (e) {
    next(e);
  }
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", async (req, res, next) => {
  let { username, password } = req.body;
  try {
    let foundUser = await User.findOne({ username }); //findOne會回傳物件，find會回傳array
    if (foundUser) {
      res.send("Username has been taken");
    } else {
      bcrypt.genSalt(saltRounds, (err, salt) => {
        if (err) {
          next(err);
        }
        // console.log("this is salt:  " + salt);
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) {
            next(err);
          }

          // console.log("this is hash :" + hash);
          let newUser = new User({ username, password: hash });
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
      });
    }
  } catch (e) {
    next(e);
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
