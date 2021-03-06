const router = require("express").Router();
const Post = require("../modules/post-model");
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

router.get("/post", authCheck, (req, res) => {
  res.render("post", { user: req.user });
});

router.get("/post", authCheck, async (req, res) => {
  let { title, content } = req.body;
  let newPost = new Post({ title, content, author: req.user._id });
  try {
    await newPost.save();
    res.status(200).redirect("/profile");
  } catch (err) {
    req.flash("error_msg", "Both title and content are required.");
    res.redirect("/profile/post");
  }
});
module.exports = router;
