
function getData(name){
    if(name == "sabrina"){
        return new Promise((reslove,reject)=>{
            setTimeout(()=>{
                reslove({name:"sabrina hu",age:Math.floor(Math.random()*10)});
            },2000);
        })
    }else{
        return new Promise((reslove,reject)=>{
            setTimeout(()=>{
                reject(new Error("Now allowed to access data"));
            },2000);
        });
    }
}

function getMovies(age){
    if(age < 12){
        return new Promise((reslove,reject)=>{
            setTimeout(()=>{
                reslove({text:"cartoon"});
            },1500);
        })
    }else if(age < 18){
        return new Promise((reslove,reject)=>{
            setTimeout(()=>{
            reslove({text:"teen movies"});
            },1500);
        })
    }else{
        return new Promise((reslove,reject)=>{
            setTimeout(()=>{
                reslove({text:"adlut movies"});
            },1500);
        })
    }
}

getData("sabrina")
.then((obj)=>{
    return getMovies(obj.age);  // 橘色整塊會return 一個Promises,所以可以繼續.then()
}).then((meg)=>{
    console.log(meg.text);
}).catch((e)=>{
    console.log(e);
})



// async function showMovie(){
//     try{
//         const obj = await getData("sabrina");
//         const movie = await getMovies(obj.age);
//         console.log(movie.text);
//     }catch(e){
//         console.log(e);
//     }
// }

// showMovie();