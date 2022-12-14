const taskInput = document.querySelector('#tbx-task'),
taskBox = document.querySelector('.task-box'),
filters = document.querySelectorAll(".filters span"),
btnClear = document.querySelector('#btn-clear');

// get all data in list
let todos = JSON.parse(localStorage.getItem("todo-list")),
editId, isEditTask = false;

filters.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showToDo(btn.id);
    });
});

function showToDo(filter){
    let li = "";
    todos.forEach((todo, id) => {
        let isComplete = todo.status === "completed" ? 'checked' : "";
        if(filter == todo.status || filter == "all"){
            li += `<li class="task">
                <label for="${id}">
                    <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${isComplete}>
                    <p class="${isComplete}">${todo.name}</p>
                </label>
                <div class="settings">
                    <i onclick='showMenu(this)' class="uil uil-ellipsis-h"></i>
                    <ul class="task-menu">
                        <li onclick='editTask(${id}, "${todo.name}")'><i class="uil uil-pen"></i>Edit</li>
                        <li onclick='deleteTask(${id})'><i class="uil uil-trash"></i>Delete</li>
                    </ul>
                </div>
            </li>`;
        }
        
    });
    taskBox.innerHTML = li || `<span>You don't have any task here</span>`;
    let checkTask = taskBox.querySelectorAll(".task");
    !checkTask.length ? btnClear.classList.remove("active") : btnClear.classList.add("active");
    taskBox.offsetHeight >= 300 ? taskBox.classList.add("overflow") : taskBox.classList.remove("overflow");
}

showToDo("all");

function showMenu(selectedTask){
    let taskMenu = selectedTask.parentElement.lastElementChild;
    taskMenu.classList.add("show");
    document.addEventListener('click', e => {
        if(e.target.tagName != "I" || e.target != selectedTask){
            taskMenu.classList.remove("show")
        }
    });
}

function updateStatus(selectedTask){
    let taskName = selectedTask.parentElement.lastElementChild;
    if(selectedTask.checked) {
        taskName.classList.add("checked");
        todos[selectedTask.id].status = "completed";
    }
    else {
        taskName.classList.remove("checked");
        todos[selectedTask.id].status = "pending";
    }
    localStorage.setItem("todo-list", JSON.stringify(todos));
    isEditTask = false;
}

function deleteTask(id){
    todos.splice(id, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showToDo("all");
    isEditTask = false;
}

function editTask(taskId, taskName){
    taskInput.value = taskName;
    editId = taskId;
    isEditTask = true;
}

btnClear.addEventListener('click', () => {
    todos.splice(0, todos.length);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showToDo();
    isEditTask = false;
});

taskInput.addEventListener('keyup', e => {
    let task = taskInput.value.trim();

    // detect if user hits enter and if input has a value
    if(e.key == "Enter" && task){
        if(!isEditTask){
            if(!todos){
                todos = [];
            }
            let taskInfo = {name: task, status: 'pending'};
            todos.push(taskInfo);
        } else {
            isEditTask = false;
            todos[editId].name = task;
        }
        
        taskInput.value = "";        
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showToDo("all");
    }
});