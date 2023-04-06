const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector("#statusText");
// const restartBtn = document.querySelector("#restartBtn");
const screen1=document.getElementById("screen1");
const screen2=document.getElementById("screen2");
const starts=document.getElementsByClassName('buttons')[0];
const scoreBoard=document.getElementsByClassName("scoreboard")[0];
const bgm = new Audio("./media/memorybgm.mp3");
bgm.loop=true;
const congrats=new Audio("./media/congrats.wav");
const tap = new Audio('./media/tap.wav');
const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = false;

function start(){
    bgm.play();
    screen1.style.left="-50vw"
    screen2.style.left="150vw";
    starts.style.display="none";
    scoreBoard.style.left="0";
    scoreBoard.style.top="10%";
    initializeGame();
}


function initializeGame(){
    restartGame();
    cells.forEach(cell => cell.addEventListener("click", cellClicked));
    statusText.textContent = `${currentPlayer}'s turn`;
    running = true;
}


function cellClicked() {
  tap.play();
  const cellIndex = this.getAttribute("cellIndex");

  if (options[cellIndex] != "" || !running || currentPlayer === "O") {
    return;
  }

  updateCell(this, cellIndex);
  checkWinner();
  currentPlayer = "O"; // switch to the next player after X's turn
  if(running===true){
  // Computer (O) plays
  setTimeout(() => {
    const emptyCells = [];
    options.forEach((cell, index) => {
      if (cell === "") {
        emptyCells.push(index);
      }
    });
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const computerCellIndex = emptyCells[randomIndex];
    const computerCell = cells[computerCellIndex];
    tap.play();
    updateCell(computerCell, computerCellIndex);
    checkWinner();
    currentPlayer = "X"; // switch back to X's turn after O's turn
  }, 1000);
}}



  


function updateCell(cell, index){
    options[index] = currentPlayer;
    cell.textContent = currentPlayer;
}
function changePlayer(){
    currentPlayer = (currentPlayer == "X") ? "O" : "X";
    statusText.textContent = `${currentPlayer}'s turn`;
}
function checkWinner(){
    let roundWon = false;

    for(let i = 0; i < winConditions.length; i++){
        const condition = winConditions[i];
        const cellA = options[condition[0]];
        const cellB = options[condition[1]];
        const cellC = options[condition[2]];

        if(cellA == "" || cellB == "" || cellC == ""){
            continue;
        }
        if(cellA == cellB && cellB == cellC){
            roundWon = true;
            break;
        }
    }

    if(roundWon){
        if(currentPlayer==="X"){
            currentPlayer="You";
            statusText.textContent = `${currentPlayer} won!`;
        }
        else{
            statusText.textContent = `You Lose!`;
        }
        
        running = false;
        scoreBoard.style.zIndex="1";
        screen1.style.left="0vw";
        screen2.style.left="50vw";
        setTimeout(()=>starts.style.display="flex",900);
        scoreBoard.style.left="40%";
        scoreBoard.style.top="40%";
        bgm.pause();
        congrats.play();
        if (currentPlayer === "X") {
            options = options.map(option => option === "" ? "X" : option);
        } else {
            options = options.map(option => option === "" ? option : "O");
        }
        let resultSpan = document.getElementById('statusText');
        let result = resultSpan.innerHTML;
        fetch('/tictactoe', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              result: result,
            })
          }).then(response => {
            // Handle the response from the backend
            return console.log("successfully sent game data");
          }).catch(error => {
            // Handle the error
            return console.log("unable to send the gamedata to backend")
          });
    }
    else if(!options.includes("")){
        statusText.textContent = `Draw!`;
        running = false;
        scoreBoard.style.zIndex="1";
        screen1.style.left="0vw"
        screen2.style.left="50vw";
        setTimeout(()=>starts.style.display="flex",900);
        scoreBoard.style.left="40%";
        scoreBoard.style.top="40%";
        bgm.pause();
        congrats.play();
        let resultSpan = document.getElementById('statusText');
        let result = resultSpan.innerHTML;
        fetch('/tictactoe', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              result: result,
            })
          }).then(response => {
            // Handle the response from the backend
            return console.log("successfully sent game data");
          }).catch(error => {
            // Handle the error
            return console.log("unable to send the gamedata to backend")
          });
    }
    else{
        changePlayer();
        
    }
}
function restartGame(){
    currentPlayer = "X";
    options = ["", "", "", "", "", "", "", "", ""];
    statusText.textContent = `${currentPlayer}'s turn`;
    cells.forEach(cell => cell.textContent = "");
    running = true;
}


function toggleDropdown() {
    dropdown = document.getElementById("myDropdown");
    arrow = document.getElementById("arrow-up");

    if(dropdown.style.display=="block"){
        dropdown.style.display="none";
        arrow.style.display="none";
    }
    else{
        dropdown.style.display="block";
        arrow.style.display="block";
}
}
