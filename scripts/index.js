const state = {
	taskList: [],
};

const taskContents = document.querySelector(".task-contents");
const taskModal = document.querySelector(".task_modal_body");

const htmlTaskContent = ({ id, title, description, type, url }) => `
    <div class="col-md-6 col-lg-4 mt-3" id=${id} key=${id}>
    <div class="card shadow-sm task__card">     
        <div class="card-header d-flex gap-2 justify-content-end task__card__header">
            <button type="button" class="btn btn-outline-info mr-2" name=${id} onclick="editTask.apply(this, arguments)">
                <i class="fa fa-pencil-alt" name=${id}></i>
            </button>
            <button type="button" onclick="deleteTask.apply(this, arguments)" class="btn btn-outline-danger mr-2" name=${id}>
                <i class="fa fa-trash-alt" name=${id}></i>
            </button>
        </div>
        <div class="card-body">
            ${
							url
								? `<img width="100%" height="150px" style="object-fit: cover; object-position: center" src=${url} alt='card image cap' class="card-image-top md-3 rounded-lg"/>`
								: `<img width="100%" height="150px" style="object-fit: cover; object-position: center" src="https://www.onlylondon.properties/application/modules/themes/views/default/assets/images/image-placeholder.png" alt='card image cap' class="img-fluid place__holder__image mb-3"/>`
						}
            <h4 class="task__card__title">${title}</h4>
            <p class="description trim-3-lines text-muted" data-gram-editor="false">
                ${description}
            </p>
            <div class="tags text-white d-flex flex-wrap">
                <span class="badge bg-primary m-1">${type}</span>
            </div>
        </div>
        <div class="card-footer">
            <button type="button" class="btn btn-outline-primary floot-right" data-bs-toggle="modal" data-bs-target="#showTask" onclick="openTask.apply(this,arguments)" id=${id}>Open Task</button>
        </div>
    </div>
    </div>
`;

const htmlModalContent = ({ id, title, description, url }) => {
	const date = new Date(parseInt(id));
	return `
        <div id="${id}">
            ${
							url
								? `<img width="100%" src=${url} alt='card image cap' class="img-fluid place__holder__image mb-3"/>`
								: `<img width="100%" src="https://www.onlylondon.properties/application/modules/themes/views/default/assets/images/image-placeholder.png" alt='card image cap' class="img-fluid place__holder__image mb-3"/>`
						}
            <strong class="text-sm text-muted">Created On ${date.toDateString()}</strong>
            <h2 class="my-3">${title}</h2>
                ${description}
            <p class="lead"></p>
        </div>
    `;
};

const updatelocalStorage = () => {
	localStorage.setItem(
		"tasks",
		JSON.stringify({
			tasks: state.taskList,
		})
	);
};

const laodInitialData = () => {
	const localStorageCopy = JSON.parse(localStorage.tasks);

	if (localStorageCopy) {
		state.taskList = localStorageCopy.tasks;
	}

	state.taskList.map((cardDate) => {
		taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardDate));
	});
};

const handleSubmit = (event) => {
	const id = `${Date.now()}`;
	const input = {
		url: document.getElementById("imageUrl").value,
		title: document.getElementById("taskTitle").value,
		description: document.getElementById("taskDescription").value,
		type: document.getElementById("tags").value,
	};

	if (input.title === "" || input.description === "" || input.type === "") {
		return alert("Please fill all the fields!!");
	}

	taskContents.insertAdjacentHTML(
		"beforeend",
		htmlTaskContent({
			...input,
			id,
		})
	);
	state.taskList.push({ ...input, id });
	updatelocalStorage();
	var myModal = new bootstrap.Modal(document.getElementById('addNewModal'));
    	myModal.hide();
	document.getElementById("imageUrl").value = '';
	document.getElementById("taskTitle").value = '';
	document.getElementById("taskDescription").value = '';
	document.getElementById("tags").value = '';
};

const openTask = (e) => {
	if (!e) e = window.event;

	const getTask = state.taskList.find(({ id }) => id === e.target.id);
	taskModal.innerHTML = htmlModalContent(getTask);
};

const deleteTask = (e) => {
	if (!e) e = window.event;
	const targetID = e.target.getAttribute("name");
	const type = e.target.tagName;
	const removeTask = state.taskList.filter(({ id }) => targetID != id);
	state.taskList = removeTask;

	updatelocalStorage();
	if (type === "BUTTON") {
		return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
			e.target.parentNode.parentNode.parentNode
		);
	}
	return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
		e.target.parentNode.parentNode.parentNode.parentNode
	);
};

const editTask = (e) => {
	if (!e) e = window.event;

	const targetID = e.target.id;
	const type = e.target.tagName;

	let parentNode, taskTitle, taskDescription, taskType, submitButton;

	if (type === "BUTTON") {
		parentNode = e.target.parentNode.parentNode;
	} else {
		parentNode = e.target.parentNode.parentNode.parentNode;
	}

	taskTitle = parentNode.childNodes[3].childNodes[3];
	taskDescription = parentNode.childNodes[3].childNodes[5];
	taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
	submitButton = parentNode.childNodes[5].childNodes[1];

	taskTitle.setAttribute("contenteditable", "true");
	taskDescription.setAttribute("contenteditable", "true");
	taskType.setAttribute("contenteditable", "true");

	submitButton.setAttribute("onclick", "saveEdit.apply(this,arguments)");
	submitButton.removeAttribute("data-bs-toggle");
	submitButton.removeAttribute("data-bs-target");
	submitButton.innerHTML = "Save Changes";
};

const saveEdit = (e) => {
	if (!e) e = window.event;

	const targetID = e.target.id;
	const parentNode = e.target.parentNode.parentNode;

	const taskTitle = parentNode.childNodes[3].childNodes[3];
	const taskDescription = parentNode.childNodes[3].childNodes[5];
	const taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
	const submitButton = parentNode.childNodes[5].childNodes[1];

	const updateData = {
		taskTitle: taskTitle.innerHTML,
		taskDescription: taskDescription.innerHTML,
		taskType: taskType.innerHTML,
	};

	let stateCopy = state.taskList;
	stateCopy = stateCopy.map((task) =>
		task.id === targetID
			? {
					id: task.id,
					title: updateData.taskTitle,
					description: updateData.taskDescription,
					type: updateData.taskType,
					url: task.url,
			  }
			: task
	);

	state.taskList = stateCopy;
	updatelocalStorage();

	taskTitle.setAttribute("contenteditable", "false");
	taskDescription.setAttribute("contenteditable", "false");
	taskType.setAttribute("contenteditable", "false");

	submitButton.setAttribute("onclick", "openTask.apply(this,arguments)");
	submitButton.setAttribute("data-bs-toggle", "modal");
	submitButton.setAttribute("data-bs-target", "#showTask");
	submitButton.innerHTML = "Open Task";
};

const searchTask = (e) => {
	if (!e) e = window.event;
	while (taskContents.firstChild) {
		taskContents.removeChild(taskContents.firstChild);
	}

	const resultData = state.taskList.filter(({ title }) => {
		return title.toLowerCase().includes(e.target.value.toLowerCase());
	});

	resultData.map((cardData) => {
		taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardData));
	});
};
