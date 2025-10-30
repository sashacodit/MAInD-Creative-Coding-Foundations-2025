const addButton = document.getElementById('add-btn');

const listButton = document.getElementById('list-view-btn');
const cardButton = document.getElementById('card-view-btn');

const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list-container');

listButton.addEventListener('click', () => {
    console.log ('List button pressed!');

    taskList.classList.remove('card-view');
    taskList.classList.add('list-view');


})


cardButton.addEventListener('click', () => {
    console.log ('Card button pressed!');

    taskList.classList.remove('list-view');
    taskList.classList.add('card-view');

})

addButton.addEventListener('click', () => {
    console.log('Add button pressed!');
    const inputValue = taskInput.value;
    const listElement = document.createElement('li');
    listElement.innerHTML = inputValue;
    taskList.appendChild(listElement);
    taskInput.value = '';

    })
