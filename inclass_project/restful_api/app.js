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


app.get("/students",async (req,res)=>{ //要從database取的資料，所以用async function
    try{
        let data = await Student.find();
        res.send(data);
    } catch{ //error handling
        res.send({message:"Error with finding data"});
    }
})


app.get("/students/:id",async (req,res)=>{
    let {id} = req.params;
    try{
        let data = await Student.findOne({id});
        if(data!==null){
            res.send(data);
        }else{
            res.status(404);
            res.send({message:"Cannot find data"});
        }
    }catch(e){ // catch是如果Student這個model發生什麼問題的話，還可以抓到這個問題
        res.send("Error");
        console.log(e);
    }
});

//代表我們正在聆聽user發出的給server資訊的request的意思，因為insert頁面的form method="POST"
app.post("/students",(req,res)=>{

    //destruct from req.body
    let {id,name,age,merit,other} = req.body; 
    //這邊創建新object,因為我們有從mongolDB裡面創建的Schema
    let newStudent = new Student({id,name,age,scholarship:{merit,other}}); 
    newStudent.save().then(()=>{
        res.send({message:"Successfully add post a new student!"});
    }).catch((e)=>{
        res.status(404);
        res.send(e);
    })
})

app.put("/students/:id",async(req,res)=>{
    let {id,name,age,merit,other} = req.body;
    try{
        let d = await Student.findOneAndUpdate({id},{id,name,age,scholarship:{merit,other}},{new:true,runValidators:true});
    res.send("Successfully update the data");
    }catch{
        res.status(404);
        res.send("Update Failed");
    }
});

class newData{
    constructor(){}
    setProperty(key,value){
        if(key!== "merit" && key!=="other"){
            this[key] = value;
        }else{
            this[`scholarship.${key}`]=value;
        }
    }
}

app.patch("/students/:id",async (req,res)=>{
    let {id} = req.params;
    
    let newObject = new newData();
    for(let property in req.body){
        newObject.setProperty(property,req.body[property]);
    }
    console.log(newObject);
    try{
        let d = await Student.findOneAndUpdate(
            {id},
            newObject,
            {   new: true,
                runValidators: true,
            }
        );
        console.log(d);
    res.send("Successfully update the data");
    }catch(e){
        res.status(404);
        res.send(e);
    }
})

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

app.delete("/students/delete",(req,res)=>{
    Student.deleteMany({}).then(meg=>{
        console.log(meg);
        res.send("Deleted all data Successfully.");
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

