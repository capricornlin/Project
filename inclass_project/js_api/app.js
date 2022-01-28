


const express = require("express");
const app = express();
const ejs = require("ejs");
const https = require('https');
const fetch = require("node-fetch");

//api key
let mykey = "4aeef9c39e37d073ea4838a8b30f1b61";

//k to c
function ktoC(k){
    return (k-273.15).toFixed(2);
}

//middLeware
app.use(express.static("public"));
app.set("view engine","ejs");

app.get("/",(req,res)=>{
    res.render("index.ejs");
})

app.get("/:city",async (req,res)=>{
    let {city} = req.params; //destruct
    let url =  `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${mykey}`;
    let d = await fetch(url);
    let djs = await d.json();
    let {temp} = djs.main;
    let newTemp = ktoC(temp);
    res.render("weather.ejs",{djs,newTemp});    
})

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})






