const router = require("express").Router();

//middlwware
//TODO: 這個middleware是在route "/" 才會觸發，所以寫在route.get("/",authCheck,(req,res))中間
//如果是前面寫成app.use("/",(req,res,next)=>{}) 的形式也可以，但寫起來比較複雜
const authCheck = (req, res, next) => {
  // console.log(req.user);
  if (!req.isAuthenticated()) {
    res.redirect("/auth/login");
  } else {
    next();
  }
};

router.get("/", authCheck, (req, res) => {
  res.render("profile", { user: req.user });
});

module.exports = router;
