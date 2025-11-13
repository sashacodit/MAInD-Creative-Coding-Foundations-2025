// console.log("Ciao");

// const SPORTS = ['Calcio', 'Tennis', 'Pallavolo', 'Basket'];
// console.log(SPORTS.length);
// console.log(SPORTS[0]);

// const PERSON ={
//     name:"Sasha",
//     lastName: 'Bravo',
//     sports: ['Calcio', 'Tennis', 'Pallavolo', 'Basket']
// }
// console.log(PERSON.name);

// const CONTAINER = document.getElementById('container');

// for (sport of PERSON.sports){

//     const ITEM = document.createElement('li');
//     ITEMtextContent = sport;
//     ITEM.innerHTML = sport;

//     CONTAINER.appendChild(ITEM);
// }

fetch('./assets/data/data.json')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

function displayData(data) {
  console.log(data);

  for (item of data.sports) {
    const ITEM = document.createElement('li');
    ITEMtextContent = sport;
    ITEM.innerHTML = sport;

    CONTAINER.appendChild(ITEM);
  }
}

function displayError(error) {
  console.log(error);
}


