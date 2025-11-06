function printInfo(name, surname,  course) 
{
    console.log("Name: "+ name + " " + surname + ",  course" + course);
}

function printGrades(name, surname, grades)
{
   console.log("Name: " + name + ", Surname: " + surname + ",  grades" + course);
}

let time = 5000;
setTimeout(() => {
    console.log("Andrei was late for class by" + time + " milliseconds");
}, time);

printInfo("Andrei", "Ioffe", "Creative Coding Foundations");