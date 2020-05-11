// Selecting Elements
const form = document.querySelector("#todo-form")
const todoInput = document.querySelector("#todo")
const todoList = document.querySelector(".list-group")
const cardBodyFirst = document.querySelectorAll(".card-body")[0]
const cardBodySecond = document.querySelectorAll(".card-body")[1]

const filter = document.querySelector("#filter")

const clearButton = document.querySelector("#clear-todos")
const downloadButton = document.querySelector("#download-todos")

// Initially setup event listeners.
eventListeners()

function eventListeners(){
    // All event listeners
    document.addEventListener("DOMContentLoaded", loadAllTodosToUI)
    form.addEventListener("submit", addTodo)
    cardBodySecond.addEventListener("click", deleteTodo)
    filter.addEventListener("keyup", filterTodos)
    clearButton.addEventListener("click", clearAllTodos)
}


function clearAllTodos() {
    // Remove Todos from UI
    if (confirm("Are you sure to clear all items?")) {
        // Clicked OK on confirm popup
        // todoList.innerHTML = "" // This is a slow process, used in small projects
        
        // Remove all elements one by one until there are no child objects
        while(todoList.firstElementChild !== null) {
            todoList.removeChild(todoList.firstElementChild)
        }

        localStorage.removeItem("todos")
    }
}

function filterTodos(e) {
    const filterValue = e.target.value.toLowerCase()
    const listItems = document.querySelectorAll(".list-group-item")

    listItems.forEach(item => {
        const text = item.textContent.toLowerCase()
        if (text.indexOf(filterValue) === -1){
            // Filter text cannot be found
            item.setAttribute("style", "display: none !important") // !important to override Bootstrap display attribute
        }
        else {
            item.setAttribute("style", "display: block")
        }
    })

}

function deleteTodo(e) {
    // Detecting where on second card body clicked
    if (e.target.className === "fa fa-trash-o" || e.target.className === "delete-item") {
        // Removing li element based on click point
        if (e.target.parentElement.nodeName === "A") {
            e.target.parentElement.parentElement.remove()
            deleteTodoFromLocalStorage(e.target.parentElement.parentElement.textContent)
        }
        else {
            e.target.parentElement.remove()
            deleteTodoFromLocalStorage(e.target.parentElement.textContent)
        }
        showAlert("info", "Todo successfully deleted.")
    }
}

function deleteTodoFromLocalStorage(todo) {
    // Removing items from local storage
    let todos = getTodosFromLocalStorage()

    todos.forEach((item, index) => {
        // Deleting a value from an array
        if (item === todo) {
            todos.splice(index, 1)
        }
    })

    // Set updated array as a string to local storage
    localStorage.setItem("todos", JSON.stringify(todos))

}

function loadAllTodosToUI() {
    // Loading all items in todos list from local storage
    let todos = getTodosFromLocalStorage()
    todos.forEach(item => {
        addTodoToUI(item)
    })
}

function addTodo(e){
    const newTodo = todoInput.value.trim()

    if (newTodo.length !== 0){
        if (!doesTodoExist(newTodo)) {
            addTodoToUI(newTodo)
            addTodoToLocalStorage(newTodo)
            showAlert("success", "Todo successfully added.")
        }
        else {
            showAlert("warning", "This Todo item exists")
        }
    } 
    else {
        showAlert("danger", "Please enter a Todo...")
    }
    
    todoInput.value = ""
    e.preventDefault()
}

function doesTodoExist(newTodo) {
    let returnValue = false
    const listItems = document.querySelectorAll(".list-group-item")

    listItems.forEach(item => {
        const text = item.textContent
        if (newTodo === text) {
            returnValue = true
        }
    })

    return returnValue
}

function getTodosFromLocalStorage() {
    // Getting todos array from local storage

    let todos
    // Check if the key exists in storage
    if (localStorage.getItem("todos") === null) {
        // Create empty todos list array
        todos = []
    }
    else {
        // Convert storage item into an array
        todos = JSON.parse(localStorage.getItem("todos"))
    }
    return todos
}

function addTodoToLocalStorage(newTodo) {
    let todos = getTodosFromLocalStorage()
    todos.push(newTodo)
    localStorage.setItem("todos", JSON.stringify(todos))
}

function showAlert(type, message) {
    /*
    <div class="alert alert-danger" role="alert">
        This is a danger alert—check it out!
    </div>
    */
   const alert = document.createElement("div")
   alert.className = `alert alert-${type}`
   alert.textContent = message
   cardBodyFirst.appendChild(alert)

   // Set timeout method to delay some actions
   setTimeout(function() {
       alert.remove()
   },1500) // 1500ms
}

function addTodoToUI(newTodo){
    /*Create a list item in HTML
    <li class="list-group-item d-flex justify-content-between">
        newTodo
        <a href="#" class="delete-item">
            <i class="fa fa-trash-o"></i>
        </a>
    </li>
    */
    
    // Creating list element
    const listItem = document.createElement("li")
    listItem.className = "list-group-item d-flex justify-content-between"
    // Creating a link inside list element
    const link = document.createElement("a")
    link.href = "#"
    link.className = "delete-item"
    link.innerHTML = "<i class='fa fa-trash-o'></i>"

    // Adding text as a text node & Adding link inside the list element
    listItem.appendChild(document.createTextNode(newTodo))
    listItem.appendChild(link)

    // Adding list element into the list group (ul)
    todoList.appendChild(listItem)
    
}



