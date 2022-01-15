
let section = document.querySelector("section");
let add = document.querySelector("form button");
add.addEventListener("click",e=>{

    //prevent form from being submitted
    e.preventDefault();

    //get the input values
    let form = e.target.parentElement;
    let todoText = form.children[0].value;
    let todoMon = form.children[1].value;
    let todoDay = form.children[2].value;
    
    if(todoText === ""){
        alert("Please enter some text.");
        return;
    }


    //create a todo
    let todo = document.createElement("div");
    todo.classList.add("todo");
    let text = document.createElement("p");
    text.classList.add("todo-text");
    text.innerText = todoText;
    let time = document.createElement("p");
    time.classList.add("todo-time");
    time.innerText = todoMon + " / " + todoDay;
    todo.appendChild(text);
    todo.appendChild(time);

    //create green check and red trash can
    let completeButton = document.createElement("button");
    completeButton.classList.add("complete");
    completeButton.innerHTML = '<i class="fas fa-check"></i>';
    completeButton.addEventListener("click",e=>{
        let todoItem = e.target.parentElement
        todoItem.classList.toggle("done");
        
    })

    let trashButton = document.createElement("button");
    trashButton.classList.add("remove");
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.addEventListener("click",e=>{
        let todoItem = e.target.parentElement;
        todoItem.style.animation ="scaleDown 0.3s forwards";
        todoItem.addEventListener("animationend", ()=>{
            
            let text = todoItem.children[0].innerText;
            let myListArray = JSON.parse(localStorage.getItem("list"));
            myListArray.forEach((item,index) =>{
                if(item.todoText == text){
                    myListArray.splice(index,1);
                    localStorage.setItem("list",JSON.stringify(myListArray));
                }
            })
             todoItem.remove();
         })
    })

    todo.appendChild(completeButton);
    todo.appendChild(trashButton);

    todo.style.animation = "scaleUp 0.3s forwards";

    //create an object
    let myTodo = {
        todoText:todoText,
        todoMonth:todoMon,
        todoDate:todoDay
    }


   //store data into an array of objects
   let myList = localStorage.getItem("list");
   if(myList == null){
       localStorage.setItem("list",JSON.stringify([myTodo]));
   }else{
       let myListArray = JSON.parse(myList);
       myListArray.push(myTodo);
       localStorage.setItem("list",JSON.stringify(myListArray));
   }

   // console.log(JSON.parse(localStorage.getItem("list")));



   form.children[0].value = "";

   section.appendChild(todo);
   //return;  
})

//先執行一次
loadData();


function loadData(){
    let myList = localStorage.getItem("list");
if(myList!== null){
   let myListArray = JSON.parse(myList);
   myListArray.forEach(item=>{
       //create a todo
       let todo = document.createElement("div");
       todo.classList.add("todo");
       let text = document.createElement("p");
       text.classList.add("todo-text");
       text.innerText = item.todoText;
       let time = document.createElement("p");
       time.classList.add("todo-time");
       time.innerText = item.todoMonth + " / " + item.todoDate;
       todo.appendChild(text);
       todo.appendChild(time);

       let completeButton = document.createElement("button");
   completeButton.classList.add("complete");
   completeButton.innerHTML = '<i class="fas fa-check"></i>';
   completeButton.addEventListener("click",e=>{
       let todoItem = e.target.parentElement
       todoItem.classList.toggle("done");
       
   })

   let trashButton = document.createElement("button");
   trashButton.classList.add("remove");
   trashButton.innerHTML = '<i class="fas fa-trash"></i>';
   trashButton.addEventListener("click",e=>{
       let todoItem = e.target.parentElement;
       todoItem.style.animation ="scaleDown 0.3s forwards";
       todoItem.addEventListener("animationend", ()=>{
           let text = todoItem.children[0].innerText;
           let myListArray = JSON.parse(localStorage.getItem("list"));
           myListArray.forEach((item,index) =>{
               if(item.todoText == text){
                   myListArray.splice(index,1);
                   localStorage.setItem("list",JSON.stringify(myListArray));
               }
           })
            todoItem.remove();
        })
   })

   todo.appendChild(completeButton);
   todo.appendChild(trashButton);

   section.appendChild(todo);
   })
}

}


    

function mergeTime(arr1, arr2){
    let result = [];
    let i = 0;
    let j = 0;

    while(i < arr1.length && j < arr2.length){
        if(Number(arr1[i].todoMonth) > Number(arr2[j].todoMonth)){
            result.push(arr2[j]);
            j++;
        }else if(Number(arr1[i].todoMonth) < Number(arr2[j].todoMonth)){
            result.push(arr1[i]);
            i++;
        }else if(Number(arr1[i].todoMonth) == Number(arr2[j].todoMonth)){
            if(Number(arr1[i].todoDate) > Number(arr2[j].todoDate)){
                result.push(arr2[j]);
                j++;
            }else{
                result.push(arr1[i]);
                i++;
            }
        }
    }

    while(i < arr1.length){
        result.push(arr1[i]);
        i++;
    }
    while(j < arr2.length){
        result.push(arr2[j]);
        j++;
    }
    return result;
}


function mergeSort(arr){
    if(arr.length === 1){
        return arr;
    }else{
        let middle = Math.floor(arr.length/2);
        let left = arr.slice(0, middle);
        let right = arr.slice(middle,arr.length);
        return mergeTime(mergeSort(left),mergeSort(right));
    }
}

// console.log(mergeSort(JSON.parse(localStorage.getItem("list"))));

let sortButton = document.querySelector("div.sort button");

sortButton.addEventListener("click",()=>{
    //sort data
    let sortedArray = mergeSort(JSON.parse(localStorage.getItem("list")));
    localStorage.setItem("list",JSON.stringify(sortedArray));

    //remove data
    let len = section.children.length;
    for(let i = 0; i < len;i++){
        section.children[0].remove();
    }

    //load data
    loadData();
} )





