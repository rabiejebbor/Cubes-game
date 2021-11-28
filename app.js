const startButton = document.querySelector(".startButton");
const newGameButton = document.querySelector(".newGameButton");
const pointsField = document.querySelector(".points-field");
const timeField = document.querySelector(".time-field");
const gameContainer = document.querySelector(".game-container");
const resultTable = document.querySelector(".result-table");
const endScore = document.querySelector(".score");
const saveBox = document.querySelector(".save-box");
const save = document.querySelector(".save");

startButton.addEventListener("click", start);
newGameButton.addEventListener("click", newGame);
save.addEventListener("click", saveName);
window.addEventListener("click", clickedAway);

//

let interval;
let points;
let countDown;
// when changing number of columns and rows change them also in css (.game-container)
let columns = 6;
let rows = 6;
let initialCubes = 18;
let displayedObjects = [];

function initialisation() {
  displayedObjects = [];
  countDown = 60;
  timeField.innerHTML = `<p>01:00</p>`;
  points = 0;
  pointsField.innerHTML = `<p>0</p>`;
  if (interval) {
    clearInterval(interval);
  }
}

function start() {
  initialisation();
  displayCubes();
  timeLeftSimplified();
}

function newGame() {
  gameContainer.innerHTML = `<p class="start">To start playing click START !</p>`;
  resultTable.innerHTML = `<h2>Result Table</h2> <hr />`;
  initialisation();
}

function displayCubes() {
  gameContainer.innerHTML = "";
  for (let i = 0; i < initialCubes; i++) {
    gameContainer.innerHTML += `<div class="cube" id=${i}></div>`;
  }
  const cubes = document.querySelectorAll(".cube");
  cubes.forEach((cube) => {
    cube.addEventListener("click", cubeClicked);
    cube.style.backgroundColor = randomColor();
    toRandomPlace(cube);
    toRandomFreePlacePush(cube);
  });
}

function timeLeftSimplified() {
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => {
    countDown--;
    if (countDown < 0) {
      clearInterval(interval);
      diplaySaveBox();
    } else {
      let minutesLeft = Math.floor(countDown / 60);
      let secondsLeft = countDown;
      timeField.innerHTML = `<p>0${minutesLeft}:${
        secondsLeft < 10 ? `0${secondsLeft}` : `${secondsLeft}`
      }</p>`;
    }
  }, 1000);
}

function cubeClicked(cube) {
  console.log(cube);
  if (countDown > 0) {
    let clickedCube = document.getElementById(cube.target.id);
    let cubeIndex = displayedObjects.findIndex(
      (element) =>
        element.otherColumn === Number(clickedCube.style.gridColumnStart) &&
        element.otherRow === Number(clickedCube.style.gridRowStart)
    );

    displayedObjects.splice(cubeIndex, 1);
    clickedCube.remove();
    document.querySelectorAll(".cube").forEach((cube) => {
      cube.addEventListener("click", cubeClicked);
    });

    setTimeout(() => {
      let x = random(0, 2);
      for (let i = 0; i < x; i++) {
        if (x === 0) {
          return;
        } else {
          let randomId = Math.random();
          gameContainer.innerHTML += `<div class="cube" id=${randomId}></div>`;
          let newCube = document.getElementById(randomId);
          newCube.style.backgroundColor = randomColor();
          toRandomPlace(newCube);
          toRandomFreePlacePush(newCube);
          newCube.addEventListener("click", cubeClicked);
        }
      }
      document.querySelectorAll(".cube").forEach((cube) => {
        cube.addEventListener("click", cubeClicked);
      });
    }, 1000);
    points++;
    pointsField.innerHTML = `<p>${points}</p>`;
  }
}
function toRandomPlace(element) {
  let randomColumn = random(1, columns);
  let randomRow = random(1, rows);

  element.style.gridColumn = randomColumn;
  element.style.gridRow = randomRow;
}
function toRandomFreePlacePush(cube) {
  while (
    displayedObjects.find(
      (element) =>
        element.otherColumn === Number(cube.style.gridColumnStart) &&
        element.otherRow === Number(cube.style.gridRowStart)
    )
  ) {
    toRandomPlace(cube);
  }
  addToArray(cube, displayedObjects);
}
function addToArray(element, array) {
  array.push({
    otherColumn: Number(element.style.gridColumnStart),
    otherRow: Number(element.style.gridRowStart),
  });
}
function randomColor() {
  return `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(
    Math.random() * 255
  )}, ${Math.floor(Math.random() * 255)})`;
}
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function diplaySaveBox() {
  saveBox.style.display = "block";
  endScore.innerHTML = `<p>Your score: ${points} </p>`;
}

function saveName() {
  saveBox.style.display = "none";
  let name = document.getElementById("name").value;
  resultTable.innerHTML += `<div class='results'> Name: ${name} | Points: ${points} </div>`;
}

function clickedAway(event) {
  if (event.target == saveBox) {
    saveBox.style.display = "none";
  }
}

// bugs to fix :
// # when number of cubes exceeds the available grid divisions the code breaks (because of the while loop in toRandomFreePlace)
// # some times the click event listener is not added to new cubes until new cubes are created
// if you click on cube and quickly click on newgame the new cube will appear anyway
