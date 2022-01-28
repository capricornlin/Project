
const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");
const fs = require("fs");

//connect to mongoDB
mongoose.connect("mongodb://localhost:27017/exampleDB",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    })
    .then(()=>{
    console.log("connected to mongodb");
    })
    .catch((err) =>{
        console.log("Connection Failed");
        console.log(err);
    });

//define a schema
const studentSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
        maxlength:[15,"name is too long,"]
    },
    age: {
        type:Number,
        required:true,
        max:100,
        min:[0,"No one can be 0."],
        default:18
    },
    major: {
        type:String,
        enum:["SDE","Law","EE","undecided","CS"],
        default:"undecided"
    },
    language:{
        front: {
            type:String,
            defaule:"undecided"
        },
        back: {
            type:String,
            defaule:"undecided"
        }
    },
});

//create an instance method
studentSchema.methods.reportAge = function(){
    return this.age;
}

studentSchema.methods.addAge = function(){
    this.age++;
    this.save();
}

//create a static method
studentSchema.statics.setMajorToCS = function(){
    return this.updateMany({},{"major":"CS"});
}

//define middleware
studentSchema.pre("save",async function(){
    fs.writeFile("record.txt","One data is trying to be save.",e=>{
        if (e) throw e;

    });
});

studentSchema.post("save",async function(){
    fs.writeFile("record.txt","One data has been saved.",e=>{
        if (e) throw e;
    });
});


// create a model for students
 const Student  = mongoose.model("Student",studentSchema);

 const newStudent = new Student({name:"Zoey", age:16,major:"EE"});

 newStudent.save().then(()=>{
    console.log("save.");
 }).catch(e=>{
     console.log("not saved");
     fs.writeFile("record.txt","data is not saved",e=>{
         if (e) throw e;
     });
 })


app.use(express.static("public"));

app.get("/",(req,res)=>{
    res.render("index.ejs");
});

app.listen(3000, ()=>{
    console.log("server is running on port 3000~!");
})
