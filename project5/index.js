const express = require("express");
const app = express();

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const authRoute = require("./routes/auth-route");
const profileRoute = require("./routes/profile-route");
require("./config/passport");

//const cookieSession = require("cookie-session");
const passport = require("passport");
const session = require("express-session");
const flash = require("connect-flash");

mongoose
  .connect(process.env.DB_connect, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connect to mongodb atlas.");
  })
  .catch((err) => {
    console.log(err);
  });

//middLeware
app.set("view engine", "ejs");
app.use(express.json());
//原本是用bodyParser，這邊用express是因為express已經包含bodyparser
app.use(express.urlencoded({ extended: true }));
//TODO: 一定要在passport.session()前面
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

//TODO: 下面兩個middleware意思就是瀏覽器會store cookies的意思
//TODO: 初始化passport
app.use(passport.initialize());
//TODO: 有使用login session時，需要設定這個middleware
app.use(passport.session());
app.use(flash());
//TODO: res.locals is an object passed to whatever rendering engine your app is
//using (in this case ejs)
//TODO: 這樣寫在views中可以用，在views中都可以知道這個sucess_msg的值
//res.locals是一個物件，我們可以設一個sucess_msg
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg"); //只是一段message,不是觸發method的效果
  res.locals.error_msg = req.flash("error_msg");
  next();
});
app.use("/auth", authRoute);
app.use("/profile", profileRoute);

app.get("/", (req, res) => {
  res.render("index", { user: req.user });
});

app.listen(8080, () => {
  console.log("Server running on port 8080");
});
