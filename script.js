let todoLists = [];
let i = 0;
const modal = document.getElementById("modalFull");
const closeModal = document.getElementsByClassName("close")[0];
const modalContent = document.querySelector(".modal-content__inner");
const formTodo = document.querySelector(".todo-addsubmit");
const listTodo = document.querySelector(".list-todo");
const inputTodo = document.querySelector(".todo-input");

function addTodo(textTodo) {
    i++;
    const todo = {
        text: textTodo,
        checked: false,
        id: Date.now(),
    };

    todoLists.push(todo);

    listTodo.addEventListener("click", (event) => {

        if (event.target.classList.contains("edit-todo")) {
            const itemKey = event.target.parentElement.dataset.key;
            editTodo(itemKey);
        }
        if (event.target.classList.contains("delete-todo")) {
            const itemKey = event.target.parentElement.dataset.key;
            deleteTodo(itemKey);
        }
    });

    listTodo.insertAdjacentHTML(
        "beforeend",
        `<li class="todo-item" data-key="${todo.id}">
            <span class="todo-text">${todo.text}</span>
            <button class="edit-todo">
                Edit
            </button>
            <button class="delete-todo">
                Delete
            </button>
            </li>`
    );

    if (i === 5) {
        fetch("http://api.aparat.com/fa/v1/video/video/mostViewedVideos", {
            method: "get",
        })
            .then((resp) => resp.json())
            .then(function (response) {
                const videoData = response.data;
                const getVideo = videoData[Math.floor(Math.random() * videoData.length)];
                openModal(getVideo);
            });
        i = 0;
    }
}

function openModal(video) {
    modal.style.display = "block";
    modalContent.innerHTML = `<h2>${video.attributes.title}</h2><video
            id="${video.attributes.id}"
            width="600"
            height="400"
            controls
        >
            <source
                src="${video.attributes.preview_src}"
                type="video/mp4"
            />
        </video>`;
}

function editTodo(key) {
    const index = todoLists.findIndex((item) => item.id === Number(key));
    const item = document.querySelector(`[data-key='${key}']`);
    const editvalue = item.children[0].innerHTML;
    modal.style.display = "block";
    modalContent.innerHTML = `<h2 class="title-form">Edit Form</h2><form class="form-edit">
    <input type="text" class="edit-value" value="${editvalue}"/>
    <input type="submit" value="edit" class="edit-submit"/>
</form>`;

    const editForm = document.querySelector(".edit-submit");
    editForm.addEventListener("click", (event) => {
        event.preventDefault();
        const inputVal = document.querySelector(".edit-value").value;
        if(inputVal !== "") {
            modal.style.display = "none";
            item.children[0].innerHTML = inputVal;
            todoLists[index].text = inputVal;
        }
    });
}

function deleteTodo(key) {
    todoLists = todoLists.filter((item) => item.id !== Number(key));
    const item = document.querySelector(`[data-key='${key}']`);
    if(item) {
        item.remove();
    }
}

formTodo.addEventListener("click", (event) => {
    event.preventDefault();
    const textTodo = inputTodo.value.trim();
    if (textTodo !== "") {
        addTodo(textTodo);
        inputTodo.value = "";
    }
});

closeModal.onclick = function () {
    modal.style.display = "none";
};

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};
