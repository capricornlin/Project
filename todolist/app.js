
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
        // console.log(e.target.parentElement);
    })

    let trashButton = document.createElement("button");
    trashButton.classList.add("remove");
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';

    todo.appendChild(completeButton);
    todo.appendChild(trashButton);

    todo.style.animation = "scaleUp 0.3s forwards";

    section.appendChild(todo);
    
    
})