var profileName, profileLastName, profileEmail, profileSkirt, profileDifficulty
var min = 0;
var sec = 0;

var card, cards

var openedCards = [];

var timerInterval;

if (!localStorage['scoreObj']){
    var scoreEmptyObj = []
    localStorage["scoreObj"] = JSON.stringify(scoreEmptyObj);
}
if (!localStorage['scoreObjHard']){
    var scoreEmptyObjHard = []
    localStorage["scoreObjHard"] = JSON.stringify(scoreEmptyObjHard);
}


function hideWelcome() {
    document.querySelector(".welcome-container").remove()
}

function skirtChange(){
    var allCardsArr = [...document.querySelectorAll('.front')];
    for(var i=0; i< allCardsArr.length; i++){
        allCardsArr[i].classList.add('front-alt_skirt');
    }
}

function timer() {
    
    if(sec==59){
        sec = 0;
        min++;
    }
    else{
        sec++;
    }
    if(sec < 10){
        sec = "0" + sec;
    }
    document.querySelector('div.timer').innerHTML = min + ":" + sec;
}

function scoreCheck(){
    var currentScore = (60 * min) + (+sec);

    var scoreList = (localStorage["profileDifficulty"] == 'difficulty1')? JSON.parse(localStorage["scoreObj"]): JSON.parse(localStorage["scoreObjHard"]);
    console.log(scoreList);

    scoreList[scoreList.length] = [localStorage["profileName"], currentScore]

    scoreList.sort(function (a, b) {
        if (a[1] > b[1]) {
            return 1;
        }
        if (a[1] < b[1]) {
            return -1;
        }
        // a должно быть равным b
        return 0;
    });

    if (scoreList.length > 10) {
    scoreList.length = 10;
    };

    if(localStorage["profileDifficulty"] == 'difficulty1'){
        localStorage["scoreObj"] = JSON.stringify(scoreList);
    }
    else{
        localStorage["scoreObjHard"] = JSON.stringify(scoreList)
    }
    //console.log(localStorage["scoreObj"]);

}
function showHighScore(){
    var scoreListItems = [...document.querySelectorAll('ul.congratulation_high-score li')];
    var parsedHighScoreListObject = (localStorage["profileDifficulty"] == 'difficulty1')? JSON.parse(localStorage["scoreObj"]): JSON.parse(localStorage["scoreObjHard"]);
    if(localStorage["profileDifficulty"] == 'difficulty2'){
        document.querySelector('.congratulation h3').innerHTML = '6 x 3 Top results'
    }
    for(var p = 0; p < parsedHighScoreListObject.length; p++){
        scoreListItems[p].innerHTML = parsedHighScoreListObject[p][0] + " : " + parsedHighScoreListObject[p][1] + " sec."
    }
}
function congratulation(){
    setTimeout(function(){
        document.querySelector('.congratulation').style.display = 'block';
        document.querySelector('.congratulation p span').innerHTML = document.querySelector('div.timer').innerHTML;
    }, 2000)
    scoreCheck();
    showHighScore();

}


function compareCards(){
    if(openedCards[0].querySelector('div.back.side').innerHTML == openedCards[1].querySelector('div.back.side').innerHTML){
        console.log(true)

        setTimeout(
            function(){
                openedCards[0].classList.add('fade');
                openedCards[1].classList.add('fade');
                openedCards.length = 0;

                if(document.querySelectorAll('.card').length === document.querySelectorAll('.fade').length){
                    clearInterval(timerInterval);

                    congratulation();
                };
            }, 2500
        )
        

    }
    else{
        console.log(false)
        setTimeout(
            function(){
                openedCards[0].classList.remove('rotated');
                openedCards[1].classList.remove('rotated');
                openedCards.length = 0;
            }, 2000
        )
    }
}


function flipCard(){
    // if(document.getElementById("block").className == "block"){
    //     document.getElementById("block").className += " rotated";
    // }
    // else{
    //     document.getElementById("block").className = "block";
    // }
    if(openedCards.length > 1 || this == openedCards[0] || this.classList.contains('fade')){
        return console.log('too fast! or the same card! of it is faded card!')
    }
    openedCards.push(this);
    console.log(openedCards);

    

    if(!this.classList.contains("rotated")){
        this.className += " rotated";
    }

    if(openedCards.length > 1){
        compareCards();
    }

}



function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function difficultySet(){
        if(localStorage["profileDifficulty"] == 'difficulty1'){

        for(let c = 0; c < 6; c++){
            document.querySelector("div.card.extra-card").remove();
        }

        document.querySelector("div.cards-field").classList.add("cards-field_easy")
    }
}

// deck of all cards in game
const deck = document.querySelector(".cards-field");




function startGame(){



    var shuffledCards = shuffle(cards);
    for (var i= 0; i < shuffledCards.length; i++){
        [].forEach.call(shuffledCards, function(item){
            deck.appendChild(item);
        });
    }
    timerInterval = setInterval('timer()', 1000);
    // timerInterval();

}


function profileSubmit() {

    localStorage["profileName"] = document.querySelector('#profile-name').value || 'no name';
    localStorage["profileLastName"] = document.querySelector('#profile-last_name').value || 'no last name';
    localStorage["profileEmail"] = document.querySelector('#profile-email').value || 'no email';

    localStorage["profileSkirt"] = document.querySelector('.profile-checkboxes_skirt input:checked').value;
    localStorage["profileDifficulty"] = document.querySelector('.profile-checkboxes_difficulty input:checked').value;

    document.querySelector(".profile-container").remove();



    difficultySet();


    // cards array holds all cards
    card = document.getElementsByClassName("card");
    cards = [...card];
    // loop to add event listeners to each card
    for (var i = 0; i < cards.length; i++){
    
    cards[i].addEventListener("click", flipCard);
    // cards[i].addEventListener("click", displayCard);
    // cards[i].addEventListener("click", cardCheck);
    };
    //displayCard is a function we'll talk about this soon

    if(localStorage["profileSkirt"] == "skirt2"){
        skirtChange();
    }

    startGame();

}




