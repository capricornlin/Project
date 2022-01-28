const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose"); //因為schema和model都是放在local mongelDB裡
const bodyParser = require("body-parser");
const Student = require("./models/student"); //get Student model
const methodOverride = require("method-override");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true})); //讓POST可以直接使用req.body
app.set("view engine","ejs");
app.use(methodOverride("_method"));

//連接到mongoDB database 裡面有Schema和model
mongoose.connect("mongodb://localhost:27017/studentDB",{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>{
    console.log("Successfully connected to mongoDB");
}).catch(e=>{
    console.log("Connection failed");
    console.log(e);
})

//代表我們正在聆聽user發出的請求資訊request的意思,在網頁端的首頁時，要發生什麼事
app.get("/",(req,res)=>{
    res.send("This is HomePage.");
})

app.get("/students",async (req,res)=>{ //要從database取的資料，所以用async function
    try{
        let data = await Student.find();
    res.render("students.ejs",{data});  //將拿到的data丟進students.ejs裡面
    } catch{ //error handling
        res.send("Error with finging data");
    }
})

//代表我們正在聆聽user發出的請求資訊request的意思
app.get("/students/insert",(req,res)=>{
    res.render("studentInsert.ejs");
})


app.get("/students/:id",async (req,res)=>{
    let {id} = req.params;
    try{
        let data = await Student.findOne({id});
        if(data !== null){ //findOne找不到這個id會回傳null
            res.render("studentPage.ejs",{data});
        }else{
            res.send("Can't find this student! Please enter a valid id");
        }
    }catch(e){ // catch是如果Student這個model發生什麼問題的話，還可以抓到這個問題
        res.send("Error");
        console.log(e);
    }
});

//代表我們正在聆聽user發出的給server資訊的request的意思，因為insert頁面的form method="POST"
app.post("/students/insert",(req,res)=>{

    //destruct from req.body
    let {id,name,age,merit,other} = req.body; 
    //這邊創建新object,因為我們有從mongolDB裡面創建的Schema
    let newStudent = new Student({id,name,age,scholarship:{merit,other}}); 
    newStudent.save().then(()=>{
        console.log("Student accepted.");
        res.render("accepted.ejs");
    }).catch((e)=>{
        console.log("Student not accepted!!");
        console.log(e);
        res.render("rejected.ejs");
    })
    // res.send("Thanks for posting");

})

app.get("/students/edit/:id",async (req,res)=>{ 
    let {id} = req.params;
    try{
        let data = await Student.findOne({id});
        if(data !== null){
            res.render("edit.ejs",{data});
        }else{
            res.send("Can't find student!");
        }
        
    }catch(e){
        res.send("Error!!");
        console.log(e);
    }
})

app.put("/students/edit/:id",async(req,res)=>{
    console.log(req.body); //在form裡看起來還是POST,所以可以用bodyparser來取得資訊
    //findOneAndUpdate 是return a Query , 後面可以加上then
    //let {id} = req.params; //params裡只有id而已
    let {id,name,age,merit,other} = req.body;
    try{
        let d = await Student.findOneAndUpdate({id},{id,name,age,scholarship:{merit,other}},{new:true,runValidators:true});
    res.redirect(`/students/${id}`);
    }catch{
        res.render("reject.ejs");
    }
});

app.delete("/students/delete/:id",(req,res)=>{
    let {id} = req.params;
    Student.deleteOne({id}).then(meg=>{
        console.log(meg);
        res.send("Deleted Successfully.");
    }).catch(e=>{
        console.log(e);
        res.send("Delete Failed.");
    })
})

//假如route是亂碼之類的情況
app.get("/*",(req,res)=>{
    res.status(404);
    res.send("Not allowed.");
})

app.listen(3000,()=>{
    console.log("server is running on port 3000");
})

