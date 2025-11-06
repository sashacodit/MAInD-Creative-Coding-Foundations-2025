# Assignment  01

## Brief

Starting from the concept of a pinboard, implement a web page that:

- is responsive (properly layout for smartphone, tablet, and desktop)
- allows the user to add and remove elements
- allows the user to coustomize elements (i.e. colors, size)
- allows the switch between two views (at least)

## Screenshots
![alt text](DOC/List-View-New.png)
![alt text](DOC/Card-View-New.png)

## Project description

General concept is the pinboard where the user can pin some notes. About the functionality, user can add and delete notes,edit them, switch between 2 views, and customize note by changing it's color. Also there is a possibility to work on different devices because the page is responsive.

## Lista funzioni 

1) Switching to list view: anonymous function. Description: when the list button is clicked, switch to list view. Returns nothing.


2) Switching to card view: anonymous function. Description: when the card button is clicked, switch to card view. Returns nothing.


3) Adding list element: anonymous function. Description: when the add button is clicked, takes text from the input field and adds a new task to the list. 
If input field is empty - shows alert. Returns nothing.


4) Deleting a list element: anonymous function. Description: when the delete button is clicked, removes the task from the list. Returns nothing.

5) Edit list element: anonymous function. Description: when the edit button is clicked, lets user edit the text. Returns nothing.


6) Open recolor menu: anonymous function. Parameters: e - event object. Description: when the paint button is clicked, shows the color tooltip. Returns nothing.


7) Choosing new color: anonymous function. Parameters: e - event object. Description: when a color option is clicked, changes the background color of the task. Returns nothing.