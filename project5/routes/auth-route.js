//處理跟認證有關的路徑

const router = require("express").Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../modules/user-module");

router.get("/login", (req, res) => {
  res.render("login", { user: req.user });
});

router.get("/signup", (req, res) => {
  res.render("signup", { user: req.user });
});

router.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/");
});

//TODO: index.js裡面已經有bodyparser的設定了
router.post("/signup", async (req, res) => {
  console.log(req.body);
  let { name, email, password } = req.body;
  //check if data already in database
  const emailExist = await User.findOne({ email });
  //TODO: 因為我們是先run index.js後才到這個auth-route
  if (emailExist) {
    req.flash("error_msg", "Email is already been register.");
    res.redirect("/auth/signup");
  }

  const hash = await bcrypt.hash(password, 10);
  password = hash;
  let newUser = new User({ name, email, password });
  try {
    await newUser.save();
    req.flash("success_msg", "Registration success. You can Login now.");
    res.redirect("/auth/login");
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

//點下login with google
router.get(
  "/google",
  //middLeware
  passport.authenticate("google", {
    scope: ["profile", "email"],
    //TODO: 如果希望使用者每次登入系統時，可以選擇登入的帳號，則需要加入
    // scope: ["profile", "email"],
    // prompt: "select_account",
  })
);

//輸入google完帳號密碼後
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  res.redirect("/profile");
});

module.exports = router;
