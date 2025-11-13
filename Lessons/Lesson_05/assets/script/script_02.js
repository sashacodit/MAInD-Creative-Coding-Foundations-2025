const CONTAINER = document.getElementById('container');

fetch('./assets/data/MOCK_DATA.json')
    .then(response => response.json())
    .then(data => displayData(data))
    .catch(error => console.error('Error:', error));

function displayData(data) {
   // console.log(data);
    


const FILTERED = data.filter((person) => person.age > 20 && person.age < 39);

console.log(FILTERED.length);

}