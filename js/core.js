const todoForm = document.querySelector('.todo-form');
const todoInput = document.querySelector('.todo-input');
const todoItemsList = document.querySelector('.todo-items');
const todoSearchInput = document.querySelector('.todo-search');

let todoList = [];
let completedList = [];


todoSearchInput.addEventListener('input', function (event) {
    completedList = JSON.parse(localStorage.getItem('completedList'));
    let allTodo = [...todoList, ...completedList];
    let resultSearchList = allTodo.filter(todo => new RegExp(todoSearchInput.value).test(todo.name));
    renderTodoList(resultSearchList);
});
    
todoForm.addEventListener('click', function (event) {
    event.preventDefault();
    if (event.target.classList.contains('delete-all-button')) {
        delAllFromLocalStorage();
    }
    if (event.target.classList.contains('add-button')) {
        addTodo(todoInput.value);
    }
    if (event.target.classList.contains('delete-last-button')) {
        todoList.pop();
        editLocalStorage(todoList);
    }
    if (event.target.classList.contains('show-todo-button')) {
        let toTodo = JSON.parse(localStorage.getItem('todoList'));
        renderTodoList(toTodo);
    }
    if (event.target.classList.contains('show-completed-button')) {
        let completedTodo = JSON.parse(localStorage.getItem('completedList'));
        renderTodoList(completedTodo, false);
    }
});
    
todoItemsList.addEventListener('click', function (event) {
    if (event.target.type === 'checkbox') {
        doneTodo(event.target.parentElement.getAttribute('data-key'));
    }
    if (event.target.classList.contains('delete-button')) {
        deleteTodo(event.target.parentElement.getAttribute('data-key'));
    }
});

// function to render given todos to screen
function renderTodoList(todoList, xButton = true) {
    todoItemsList.innerHTML = '';
    todoList.forEach(function (item) {
        const checked = item.completed ? 'checked' : null;
        const li = document.createElement('li');
        li.setAttribute('class', 'item');
        li.setAttribute('data-key', item.id);
        if (item.completed === true) {
            li.classList.add('checked');
        }
        if (xButton) {
            li.innerHTML = `
              <input type="checkbox" class="checkbox" ${checked}>
              ${item.name}
              <button class="delete-button">X</button>
            `;
        }
        else {
            li.innerHTML = `
              <input type="checkbox" class="checkbox" ${checked}>
              ${item.name}
            `;
        }

        todoItemsList.append(li);
    });
}

function addTodo(value) {
    if (value !== '') {
        const todo = {
            id: Date.now(),
            name: value,
            completed: false
        };
        todoList.push(todo);
        editLocalStorage(todoList);
        todoInput.value = '';
    }
}

// function to add task to local storage
function editLocalStorage(todoList, completedList = null) {
    localStorage.setItem('todoList', JSON.stringify(todoList));
    renderTodoList(todoList);
    if (completedList != null) {
        localStorage.setItem('completedList', JSON.stringify(completedList));
    }
    renderCounter();
}

// function to del all task from local storage
function delAllFromLocalStorage() {
    localStorage.clear()
    todoList = [];
    completedList = [];
    renderTodoList(todoList);
    renderCounter();
}

// function helps to get everything from local storage
function getFromLocalStorage() {
    const referenceToTodo = localStorage.getItem('todoList');
    if (referenceToTodo) {
        todoList = JSON.parse(referenceToTodo);
        renderTodoList(todoList);
    }
    renderCounter();
}

function doneTodo(id) {
    todoList.forEach(function (item) {
        if (item.id == id) {
            item.completed = !item.completed;
            completedList.push(item);
            deleteTodo(id);
        }
    });
}

function deleteTodo(id) {
    todoList = todoList.filter(function (item) {
        return item.id != id;
    });
    editLocalStorage(todoList, completedList);
}

function renderCounter() {
    let countElement
    let referenceToTodo = JSON.parse(localStorage.getItem('todoList'));
    let referenceToCompleted = JSON.parse(localStorage.getItem('completedList'));

    if (referenceToCompleted == null) referenceToCompleted = [];
    if (referenceToTodo == null) referenceToTodo = [];
    countElement = document.getElementById('count');
    countElement.innerHTML =
        `All: ${referenceToTodo.length + referenceToCompleted.length} Completed: ${referenceToCompleted.length}`;
}

getFromLocalStorage();



























