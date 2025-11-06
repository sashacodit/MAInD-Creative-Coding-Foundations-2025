const addButton = document.getElementById('add-btn');

const listButton = document.getElementById('list-view-switch');
console.log(listButton);
const cardButton = document.getElementById('card-view-switch');
console.log(cardButton);

const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list-container');

listButton.addEventListener('click', () => {
    console.log('List button pressed!');

    taskList.classList.add('list-view-new');
    taskList.classList.remove('card-view-new');
    listButton.classList.add('active');
    cardButton.classList.remove('active');
})


cardButton.addEventListener('click', () => {
    console.log('Card button pressed!');


    taskList.classList.add('card-view-new');
    taskList.classList.remove('list-view-new');


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
        <p contenteditable="false">${inputValue}</p>
        <div class="icons-btn-container">
            <button class="edit-btn">
                <img src="assets/imgs/Edit.svg" alt="Edit">
            </button>
            <button class="paint-btn">
                <img src="assets/imgs/Paint.svg" alt="Paint">
            </button>
            <button class="delete-btn">
                <img src="assets/imgs/Trashbin.svg" alt="small trashbin icon">
            </button>
        </div>
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

    // Add edit button functionality
    const editButton = listElement.querySelector('.edit-btn');
    const contentElement = listElement.querySelector('p');

    editButton.addEventListener('click', () => {
        // Toggle contenteditable
        const isEditing = contentElement.getAttribute('contenteditable') === 'true';
        contentElement.setAttribute('contenteditable', !isEditing);
        
        // Toggle edit button state
        editButton.classList.toggle('active');
        
        if (!isEditing) {
            // Starting edit
            contentElement.focus();
            // Store original content in case we need to cancel
            contentElement.dataset.originalContent = contentElement.textContent;
        } else {
            // Finishing edit
            contentElement.blur();
            // Remove stored original content
            delete contentElement.dataset.originalContent;
        }
    });

    // Handle blur event
    contentElement.addEventListener('blur', () => {
        if (contentElement.textContent.trim() === '') {
            // If content is empty after editing, revert to original content
            if (contentElement.dataset.originalContent) {
                contentElement.textContent = contentElement.dataset.originalContent;
            }
        }
        // Disable editing
        contentElement.setAttribute('contenteditable', 'false');
        editButton.classList.remove('active');
    });

    // Prevent enter key from creating new lines
    contentElement.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            contentElement.blur();
        }
    });

    taskList.appendChild(listElement);
    taskInput.value = '';

})