const passport = require("passport");
//TODO: GoogleStrategy是一種驗證策略
//passport裡面提供很多不同的策略，我們要用google這個驗證的方式‘
const GoogleStrategy = require("passport-google-oauth20");
const User = require("../modules/user-module");

//製作cookies
//TODO: 在驗證成功後，也就是passport.use(new GoogleStrategy)而成後
//我們將done(null,User)執行，代表passport可以使用User object了
//SerializeUser是一個方法可以在獲得User物件後，決定將User物件裡的哪些片段資訊存到 login session 當中
passport.serializeUser((user, done) => {
  console.log("Serializing user now");
  //TODO: 這個意思是只要將User ID存到Session中
  done(null, user._id);
  //mongoDb會自動幫每一筆資料做出一個ID ID要寫成user._id 這是primary key
  //TODO: passport.serializeUser() 序列化的結果將被放到：req.session.passport.user or req.user
});

//TODO: deserializeUser則是當有需要更多使用者資訊時，再透過反序列化（deserialize）的方式，
//根據 User ID 把整個 user 物件實例取出。
passport.deserializeUser((_id, done) => {
  console.log("Deserializing user now");
  User.findById({ _id }).then((user) => {
    console.log("Found user");
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      //TODO: 這邊要檢視ID和secret來確認是否可以跟google拿使用者數據
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/redirect",
    },
    //TODO: 這邊是我們已經從Google那邊拿到User的資料了,可以將拿到的資料
    //帶入database裡面搜尋看是否有符合的User資料,如果沒有的話製作一個新的
    //profile就是我們從google那邊拿到的資料
    //done則是一個callback function,驗證完後將User放入done(null,user),提供給passport做使用
    (accessToken, refreshToken, profile, done) => {
      //passport callback
      console.log(profile);
      User.findOne({ googleID: profile.id }).then((foundUser) => {
        if (foundUser) {
          console.log("User already exist");
          done(null, foundUser);
        } else {
          new User({
            name: profile.displayName,
            googleID: profile.id,
            thumbnail: profile.photos[0].value,
            email: profile.emails[0].value,
          })
            .save()
            .then((newUser) => {
              console.log("New user created");
              done(null, newUser);
            });
        }
      });
    }
  )
);
