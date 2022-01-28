
const mongoose = require("mongoose");

const studentSchame = new mongoose.Schema({
    id:{
        type:Number,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    age:{
        type:Number,
        default:18,
        max:[80,"Too old in thes school"],
    },
    scholarship:{
        merit:{
            type:Number,
            min:0,
            max:[5000,"Too much"],
        },
        other:{
            type:Number,
            min:0,
        }
    }
})

//model
const Student = mongoose.model("Student",studentSchame);

//let app.js can get Student
module.exports = Student;

