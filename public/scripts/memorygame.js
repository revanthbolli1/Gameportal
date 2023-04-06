let cardArray = [
    {
        name: 'burger',
        img: 'images/burger.png'
    },
    {
        name : 'watermelon',
        img : 'images/watermelon.png'
    },
    {
        name : 'pizza',
        img : 'images/pizza.png'
    },
    {
        name : 'chocolate',
        img : 'images/chocolate.png'
    },
    {
        name : 'pineapple',
        img : 'images/pineapple.png'
    },
    {
        name : 'ice-cream',
        img : 'images/ice-cream.png'
    },
    {
        name : 'bell',
        img : 'images/bell.png'
    },
    {
        name : 'flower',
        img : 'images/flower.png'
    }

]

cardArray=[...cardArray,...cardArray];
cardArray.sort(()=> 0.5 - Math.random());

const gridDisplay = document.querySelector('#grid');
const score = document.getElementById("result");
const attempts = document.getElementById("attempts");
const highscores = document.getElementById("highscore");
let cardChosen = [];
let cardsChosenIds=[];
var cardsWon=[];
var highscore = 2;  //get from database.
let totalAttempts=2;
var attemptsLeft=9;
const tap = new Audio('./media/tap.wav');
const matched = new Audio("./media/matched.wav");
const mismatch = new Audio("./media/mismatch.wav");
const bgm = new Audio("./media/memorybgm.mp3");
bgm.loop=true;
const congrats=new Audio("./media/congrats.wav");
const gameover=new Audio("./media/gameover.wav");
const screen1=document.getElementById("screen1");
const screen2=document.getElementById("screen2");
const starts=document.getElementsByClassName('buttons')[0];
const scoreBoard=document.getElementsByClassName("scoreboard")[0];
const instructions = document.getElementsByClassName("instructions")[0];

function start(){
    bgm.play();
    screen1.style.left="-50vw"
    screen2.style.left="100vw";
    starts.style.display="none";
    setTimeout(()=>gridDisplay.style.zIndex="1",1000);
    scoreBoard.style.left="0";
    scoreBoard.style.top="10%";
    createBoard();
    instructions.style.display="none";
}


function createBoard(){
    cardsWon=[];
    score.innerText=0;
    attempts.innerText=9;
    for(let i=0; i<cardArray.length;i++){
        const card= document.createElement('img');
        card.setAttribute('src','images/blank.png');
        card.setAttribute('data-id',i);
        gridDisplay.appendChild(card);
        card.addEventListener('click',flipCard);
    }
}


function clearBoard(){
    var items = gridDisplay.getElementsByTagName("img");
    for (let i = 0; i < items.length; i++) {
        gridDisplay.removeChild(items[i]);
    }
    const duplicatedElements = [...gridDisplay.getElementsByTagName('img')];
    duplicatedElements.forEach((element) => {
    gridDisplay.removeChild(element);
    });
    attemptsLeft=9;
}



function checkMatch(){
    const cards = document.querySelectorAll("#grid img")    /*Review----------------*/
    if(cardsChosenIds[0] == cardsChosenIds[1]){
        cards[cardsChosenIds[0]].setAttribute('src', 'images/blank.png');
        cards[cardsChosenIds[0]].classList.remove('rotate');
    }

    else if(cardChosen[0] == cardChosen[1]){
        matched.play();
        cards[cardsChosenIds[0]].setAttribute('src', 'images/white.png');
        cards[cardsChosenIds[1]].setAttribute('src', 'images/white.png');
        cards[cardsChosenIds[0]].removeEventListener("click", flipCard);
        cards[cardsChosenIds[1]].removeEventListener("click", flipCard);
        cardsWon.push(cardChosen);
    }
    
    else{
        mismatch.play();
        cards[cardsChosenIds[0]].setAttribute('src', 'images/blank.png');
        cards[cardsChosenIds[1]].setAttribute('src', 'images/blank.png');
        cards[cardsChosenIds[0]].classList.remove('rotate');
        cards[cardsChosenIds[1]].classList.remove('rotate');
        
    }
    cardChosen=[];
    cardsChosenIds=[];
    score.innerText=cardsWon.length;
    if(cardsWon.length > highscore){
        highscores.innerText=cardsWon.length;  //update highscore in the database.....
    }
    attemptsLeft -=1;
    attempts.innerText=attemptsLeft;
    if(attemptsLeft>=0 && cardsWon.length==cardArray.length/2){
        // score.innerText = "Yay, You are Einstein!";
        bgm.pause();
        congrats.play();
        screen1.style.left="0vw"
        screen2.style.left="50vw";
        starts.style.display="flex";
        setTimeout(()=>gridDisplay.style.zIndex="-1",500);
        scoreBoard.style.zIndex="1";
        setTimeout(()=>
        {
            scoreBoard.style.left="40%";
            scoreBoard.style.top="21%";
        },500);
        instructions.style.display="block";
        clearBoard();
        let resultSpan = document.getElementById('result');
        let attemptSpan = document.getElementById('attempts')
        let result = resultSpan.innerHTML;
        let attemptscore=attemptSpan.innerHTML;
        console.log(result,attemptscore);
        fetch('/game', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            score: result,
            attempts: attemptscore,
            
            })
        }).then(response => {
            // Handle the response from the backend
            return console.log("successfully sent game data");
        }).catch(error => {
            // Handle the error
            return console.log("unable to send the gamedata to backend")
        });

    }
    else if(attemptsLeft==0){
        // console.log("Game Over!");
        bgm.pause();
        gameover.play();
        screen1.style.left="0vw"
        screen2.style.left="50vw";
        starts.style.display="flex";
        setTimeout(()=>gridDisplay.style.zIndex="-1",500);
        scoreBoard.style.zIndex="1";
        setTimeout(()=>
        {
            scoreBoard.style.left="40%";
            scoreBoard.style.top="21%";
        },500);
        instructions.style.display="block";
        clearBoard();
        /*send data to the database*/
        let resultSpan = document.getElementById('result');
        let attemptSpan = document.getElementById('attempts')
        let result = resultSpan.innerHTML;
        let attemptscore=attemptSpan.innerHTML;
        console.log(result,attemptscore);
        fetch('/game', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            score: result,
            attempts: attemptscore,
            
            })
        }).then(response => {
            // Handle the response from the backend
            return console.log("successfully sent game data");
        }).catch(error => {
            // Handle the error
            return console.log("unable to send the gamedata to backend")
        });

    }

}
function flipCard(){
    tap.play();
    const cardId = this.getAttribute('data-id');
    // console.log(cardArray[cardId]);
    cardChosen.push(cardArray[cardId].name);
    cardsChosenIds.push(cardId);
    // console.log(cardsChosenIds);
    this.setAttribute('src',cardArray[cardId].img);
    this.setAttribute('class','rotate');
    if(cardChosen.length === 2){
        setTimeout(checkMatch,500);
    }
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