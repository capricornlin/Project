

let header = document.querySelector("header");
let headerAnchor = document.querySelectorAll("header nav ul li a");
console.log(headerAnchor);

window.addEventListener("scroll", () =>{
    if(window.pageYOffset != 0){
        header.style.backgroundColor = "rgba(0,0,0,0.5)";
        // header.style.color = "white";
        headerAnchor.forEach(a => {
            a.style.color = "white";
        })
    }else{
        header.style = "";
        headerAnchor.forEach(a => {
            a.style.color = "#09777d";
        })
    }
})

