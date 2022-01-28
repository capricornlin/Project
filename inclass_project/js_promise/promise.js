
let example = new Promise((reslove,reject)=>{
    //reslove({name:"sabrina",age:17});
    reject(new Error("not allowed"));
});

example.then(d=>{
    console.log(d);
}).catch(e=>{
    console.log(e);
})