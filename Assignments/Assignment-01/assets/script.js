const addButton = document.getElementById('add-btn');

const listButton = document.getElementById('list-view-switch');
console.log(listButton);
const cardButton = document.getElementById('card-view-switch');
console.log(cardButton);

const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list-container');

listButton.addEventListener('click', () => {
    console.log('List button pressed!');

    taskList.classList.remove('list-view');
    taskList.classList.add('card-view');
    listButton.classList.add('active');
    cardButton.classList.remove('active');


})


cardButton.addEventListener('click', () => {
    console.log('Card button pressed!');


    taskList.classList.remove('card-view');
    taskList.classList.add('list-view');


    cardButton.classList.add('active');
    listButton.classList.remove('active');



})

addButton.addEventListener('click', () => {
    console.log('Add button pressed!');
    const inputValue = taskInput.value;
    const listElement = document.createElement('li');
    listElement.innerHTML = inputValue;
    taskList.appendChild(listElement);
    taskInput.value = '';

})
