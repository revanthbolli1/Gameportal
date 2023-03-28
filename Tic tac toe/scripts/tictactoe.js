const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector("#statusText");
// const restartBtn = document.querySelector("#restartBtn");
const screen1=document.getElementById("screen1");
const screen2=document.getElementById("screen2");
const starts=document.getElementById('start');
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
    screen2.style.left="100vw";
    starts.style.display="none";

    scoreBoard.style.left="0";
    scoreBoard.style.top="10%";
    // createBoard();
    initializeGame();
}


function initializeGame(){
    restartGame();
    cells.forEach(cell => cell.addEventListener("click", cellClicked));
    // restartBtn.addEventListener("click", restartGame);
    statusText.textContent = `${currentPlayer}'s turn`;
    running = true;
}
function cellClicked(){
    tap.play();
    const cellIndex = this.getAttribute("cellIndex");

    if(options[cellIndex] != "" || !running){
        return;
    }

    updateCell(this, cellIndex);
    checkWinner();
}
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
        statusText.textContent = `${currentPlayer} wins!`;
        running = false;
        scoreBoard.style.zIndex="1";
        screen1.style.left="0vw"
        screen2.style.left="50vw";
        starts.style.display="block";
        scoreBoard.style.left="40%";
        scoreBoard.style.top="40%";
        bgm.pause();
        congrats.play();
    }
    else if(!options.includes("")){
        statusText.textContent = `Draw!`;
        running = false;
        scoreBoard.style.zIndex="1";
        screen1.style.left="0vw"
        screen2.style.left="50vw";
        starts.style.display="block";
        scoreBoard.style.left="40%";
        scoreBoard.style.top="40%";
        bgm.pause();
        congrats.play();
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





