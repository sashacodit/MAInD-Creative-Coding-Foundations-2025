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
    if (taskInput.value === '') {
        alert('Please enter a task before adding.');
        return;
    }

    console.log('Add button pressed!');
    const inputValue = taskInput.value;
    const listElement = document.createElement('li');
    listElement.className = 'list-element-container';
    listElement.innerHTML = `
        <p>${inputValue}</p>
        <button class="paint-btn">
            <img src="assets/imgs/Paint.svg" alt="small fill icon">
        </button>
        <button class="delete-btn">
            <img src="assets/imgs/Trashbin.svg" alt="small trashbin icon">
        </button>
    `;


    const deleteButton = listElement.querySelector('.delete-btn');
    deleteButton.addEventListener('click', () => {
        taskList.removeChild(listElement);
    });

    const paintButton = listElement.querySelector('.paint-btn');
    paintButton.innerHTML +=  `<div class="color-tooltip">
                        <div class="color-option color-blue" data-color="#D2E0FB"></div>
                        <div class="color-option color-green" data-color="#D2FBD5"></div>
                        <div class="color-option color-yellow" data-color="#FBF6D2"></div>
                        <div class="color-option color-pink" data-color="#FBD2F3"></div>
                    </div>`;


    // Get the tooltip reference AFTER adding it to the DOM
    const tooltip = paintButton.querySelector('.color-tooltip');

    paintButton.addEventListener('click', (e) => {
        e.stopPropagation();
        tooltip.classList.toggle('show');
    });

    // Hide tooltip when clicking outside
    document.addEventListener('click', () => {
        tooltip.classList.remove('show');
    });

    // Handle color selection
    paintButton.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const color = option.dataset.color;
            listElement.style.backgroundColor = color;
            tooltip.classList.remove('show');
        });
    });



    taskList.appendChild(listElement);
    taskInput.value = '';

})

// document.querySelectorAll('.paint-btn').forEach(btn => {
//     const tooltip = btn.querySelector('.color-tooltip');
    
//     btn.addEventListener('click', (e) => {
//         e.stopPropagation();
//         tooltip.classList.toggle('show');
//     });

//     // Hide tooltip when clicking outside
//     document.addEventListener('click', () => {
//         tooltip.classList.remove('show');
//     });

//     // Handle color selection
//     btn.querySelectorAll('.color-option').forEach(option => {
//         option.addEventListener('click', (e) => {
//             e.stopPropagation();
//             const color = option.dataset.color;
//             const listItem = btn.closest('.list-element-container');
//             listItem.style.backgroundColor = color;
//             tooltip.classList.remove('show');
//         });
//     });
// });
