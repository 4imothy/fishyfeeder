var character;
var characterCSS;
var characterWidth;
var characterHeight;
var hFishH;
var hFishW;
var eTextF;
var hitBoxL;

const game = document.getElementById("game");
const gameCSS = window.getComputedStyle(game);
const startButton = document.getElementById("startButton");
const soundButton = document.getElementById("soundButton");
const gameElements = document.getElementById("gameElements");
//time increment has to be a multiple of 100
var timeIncrement = 10;
var minimumTimeBetweenSummon = 500;
var feedToIncreaseSummonSpeed = 5;
var timeBetweenSummonChange = 200;
var timeBetweenSummon = 2000;
var characterSpeed;

var pressed = [];
var hungryFish = [];

var numberHungryFish;
var time;

var numberDestroyed;
var wasFishFed;
var gameOver;

var newHeight;
var newWidth;

document.addEventListener("DOMContentLoaded", function () {
    //dom is fully loaded, but maybe waiting on images & css files
    window.addEventListener('resize', resizeGame, false);
    window.addEventListener('orientationchange', resizeGame, false);
    resizeGame();
    loadScores();
    //if you declare this above creates bug with click to start hovering strange
    gameOver = true;
    console.log("done loading");
});

//this is for sound//this is for sound
var sfx = {
    fed: null,
    eaten: null,
    pop: null
}
var soundOn = false;
var firstSoundChange = true;

//to get text input and change mute on 'm' press and start on space press
document.onkeydown = function (e) {
    var input = e.key.toLowerCase();
    //change space
    if (input == ' ') {
        if (gameOver) {
            resizeGame();
            startGame();
            if (soundOn) {
                sfx.fed.play();
            }
        }
    }
    //change sound
    if (input == 'm') {
        if (soundOn) {
            soundOn = false;
            soundButton.style.backgroundImage = "var(--bg_Off)";
        } else {
            if (firstSoundChange) {
                sfx.fed = new Howl({
                    src: ['https://res.cloudinary.com/dmr8ozkfj/video/upload/v1652281797/fishyfeederres/audio/success.mp3']
                });
                sfx.eaten = new Howl({
                    src: ['https://res.cloudinary.com/dmr8ozkfj/video/upload/v1652281797/fishyfeederres/audio/munch.mp3']
                });
                sfx.pop = new Howl({
                    src: ['https://res.cloudinary.com/dmr8ozkfj/video/upload/v1652295593/fishyfeederres/audio/popSound.mp3']
                });
                firstSoundChange = false;
            }
            soundOn = true;
            soundButton.style.backgroundImage = "var(--bg_On)";
        }
    }
    if (!gameOver)
        pressed[input] = e.type == "keydown";

}
document.onkeyup = function (e) {
    var input = e.key.toLowerCase();
    if (!gameOver)
        pressed[input] = e.type == "keydown";
}

function resizeGame() {
    //to repos the char
    if (character != null) {
        var charLtoW = parseInt(character.style.left) / parseInt(game.style.width);
        var charTtoH = parseInt(character.style.top) / parseInt(game.style.height);
    }

    var widthToHeight = 750 / 400;
    newWidth = window.innerWidth * 0.75;
    newHeight = window.innerHeight * 0.75;
    var newWidthToHeight = newWidth / newHeight;

    //if width increased more or height decreased more
    if (newWidthToHeight > widthToHeight) {
        newWidth = newHeight * widthToHeight;
        game.style.height = newHeight + 'px';
        game.style.width = newWidth + 'px';
    } else {
        newHeight = newWidth / widthToHeight;
        game.style.width = newWidth + 'px';
        game.style.height = newHeight + 'px';
    }
    //brings to center
    game.style.marginTop = (-newHeight / 2) + 'px';
    game.style.marginLeft = (-newWidth / 2) + 'px';

    if (character != null) {
        character.style.left = charLtoW * newWidth + 'px';
        character.style.top = charTtoH * newHeight + 'px';
    }
    characterWidth = (50 / 750) * newWidth
    characterHeight = characterWidth * (33 / 50);
    //set h and w hungry fish and the evil under fish
    hFishW = (40 / 750) * (newWidth);
    hFishH = hFishW * (32 / 40);
    //set for hit box 
    hitBoxL = (20 / 750) * (newWidth);
    //set for text
    eTextF = (15 / 750) * (newWidth);
    //character speed
    characterSpeed = (7 / 750) * (newWidth);

    //resize border width
    var bWidth = (5 / 1152) * newWidth;
    game.style.border = bWidth + "px solid black";
    //resize title
    var titleW = (589 / 750) * (newWidth);
    var titleH = (79 / 750) * (newWidth);
    document.getElementById("title").style.width = titleW + "px";
    document.getElementById("title").style.height = titleH + "px";
    document.getElementById("title").style.marginLeft = "10%";
    document.getElementById("title").style.marginTop = "-11%";

    //resize scores
    var fontSize = (17 / 1152) * newWidth;
    document.getElementById("currentScore").style.fontSize = fontSize + "px";
    document.getElementById("highScores").style.fontSize = fontSize + "px";

    //resize start button
    var buttonW = (300 / 750) * (newWidth);
    var buttonH = (250 / 750) * newHeight;
    startButton.style.width = buttonW + "px";
    startButton.style.height = buttonH + "px";

    //resize the sound button
    buttonW = (50 / 1152) * newWidth;
    buttonH = (50 / 614.4) * newHeight;
    soundButton.style.width = buttonW + "px";
    soundButton.style.height = buttonH + "px";

    //resize the directions
    var directionsW = (750 / 750) * (newWidth);
    var directionsH = (150 / 750) * newHeight
    document.getElementById("directions").style.width = directionsW + "px";
    document.getElementById("directions").style.height = directionsH + "px";

    //resize the beginning of the result text
    var beginResultW = (220 / 750) * (newWidth);
    var beginResultH = (125 / 750) * newHeight;
    document.getElementById("beginResult").style.width = beginResultW + "px";
    document.getElementById("beginResult").style.height = beginResultH + "px";

    //resize the end result text
    var endResultW = (275 / 750) * (newWidth);
    var endResultH = (150 / 750) * newHeight;
    document.getElementById("endResult").style.width = endResultW + "px";
    document.getElementById("endResult").style.height = endResultH + "px";

    var gameChildren = gameElements.children;
    for (var i = 0; i < gameChildren.length; i++) {
        var currentChild = gameChildren[i];
        if (currentChild.classList.contains("character")) {
            currentChild.style.width = characterWidth + "px";
            currentChild.style.height = characterHeight + "px";
        } else if (currentChild.classList.contains("hungryFish")) {
            currentChild.style.width = hFishW + "px";
            currentChild.style.height = hFishH + "px";
        }
        else if (currentChild.classList.contains("evilFish")) {
            //fills up that ^ amount of the screen
            currentChild.style.width = hFishW + "px";
            currentChild.style.height = hFishH + "px";
        } else if (currentChild.classList.contains("hitBox")) {
            //this is a square
            currentChild.style.width = hitBoxL + "px";
            currentChild.style.height = hitBoxL + "px";
        } else if (currentChild.classList.contains("enemyText")) {
            currentChild.style.fontSize = eTextF + "px";
        }
    }

    //reposition end game things
    if (gameOver) {
        //make these all into background images
        var numberW = (45 / 750) * (newWidth);
        var numberH = (90 / 750) * (newWidth);

        var changeConstX = (50 / 750) * (newWidth);
        var changeConstY = (-90 / 400) * newHeight
        var transX = (265 / 750) * (newWidth);
        var transY = (-130 / 750) * (newWidth);

        number1 = document.getElementById("number1");
        number1.style.width = numberW + "px";
        number1.style.height = numberH + "px";
        number1.style.transform = "translate(" + transX + "px, " + transY + "px)";
        number1.style.backgroundSize = "100%";
        number1.style.backgroundRepeat = "no-repeat";
        number1.style.display = "flex";

        transX = transX + changeConstX;
        transY = transY + changeConstY;
        number2 = document.getElementById("number2");
        number2.style.width = numberW + "px";
        number2.style.height = numberH + "px";
        number2.style.transform = "translate(" + transX + "px, " + transY + "px)";
        number2.style.backgroundSize = "100%";
        number2.style.backgroundRepeat = "no-repeat";
        number2.style.display = "flex";

        transX = transX + changeConstX;
        transY = transY + changeConstY;
        number3 = document.getElementById("number3");
        number3.style.width = numberW + "px";
        number3.style.height = numberH + "px";
        number3.style.transform = "translate(" + transX + "px, " + transY + "px)";
        number3.style.backgroundSize = "100%";
        number3.style.backgroundRepeat = "no-repeat";
        number3.style.display = "flex";


        //this check is to move the "fishes, nice" to the right
        //fix this later to look better

        var hundreds = Math.floor(numberDestroyed / 100 % 10);
        var tens = Math.floor(numberDestroyed / 10 % 10);

        var check = 0;
        if (hundreds != 0)
            check = 3;
        else if (tens != 0)
            check = 2;
        else
            check = 1;

        if (check == 3)
            document.getElementById("endResult").style.transform = "translate(150%, -500%)";
        if (check == 2)
            document.getElementById("endResult").style.transform = "translate(132%, -500%)";
        //document.getElementById("endResult").style.transform = "translate(" + leftShift2 + "%, -170%);"
        if (check == 1)
            document.getElementById("endResult").style.transform = "translate(112%, -500%)";
    }
}

startButton.onclick = function () {
    if (gameOver) {
        resizeGame();
        startGame();
        if (soundOn) {
            sfx.fed.play();
        }
    }
}

soundButton.onclick = function () {
    if (soundOn) {
        soundOn = false;
        soundButton.style.backgroundImage = "var(--bg_Off)";
    }
    else {
        if (firstSoundChange) {
            sfx.fed = new Howl({
                src: ['https://res.cloudinary.com/dmr8ozkfj/video/upload/v1652281797/fishyfeederres/audio/success.mp3']
            });
            sfx.eaten = new Howl({
                src: ['https://res.cloudinary.com/dmr8ozkfj/video/upload/v1652281797/fishyfeederres/audio/munch.mp3']
            });
            sfx.pop = new Howl({
                src: ['https://res.cloudinary.com/dmr8ozkfj/video/upload/v1652295593/fishyfeederres/audio/popSound.mp3']
            });
            firstSoundChange = false;
        }
        soundOn = true;
        soundButton.style.backgroundImage = "var(--bg_On)";
    }
}

soundButton.onmouseover = function () {
    if (soundOn)
        soundButton.style.backgroundImage = "var(--bg_Off)";
    else
        soundButton.style.backgroundImage = "var(--bg_On)";
}
soundButton.onmouseout = function () {
    if (soundOn)
        soundButton.style.backgroundImage = "var(--bg_On)";
    else
        soundButton.style.backgroundImage = "var(--bg_Off)";
}

startButton.onmouseover = function () {
    startButton.style.backgroundImage = "var(--bg_On)";
}
startButton.onmouseout = function () {
    startButton.style.backgroundImage = "var(--bg_Off)";
}

function startGame() {
    //removes fish and characters
    gameElements.style.display = "inline";
    game.style.animation = "";
    startButton.style.display = "none";
    document.getElementById("beginResult").style.display = "none";
    document.getElementById("endResult").style.display = "none";
    document.getElementById("number1").style.display = "none";
    document.getElementById("number2").style.display = "none";
    document.getElementById("number3").style.display = "none";
    document.getElementById("currentScore").innerHTML = "Score: 0";

    //remove all child for numbers

    var child = gameElements.lastElementChild;
    while (child) {
        gameElements.removeChild(child);
        child = gameElements.lastElementChild;
    }

    document.getElementById("directions").style.display = "none";

    //reset keys pressed and fish
    pressed["w"] = false;
    pressed["a"] = false;
    pressed["s"] = false;
    pressed["d"] = false;
    pressed["arrowup"] = false;
    pressed["arrowright"] = false;
    pressed["arrowdown"] = false;
    pressed["arrowleft"] = false;

    hungryFish.length = 0;

    minimumTimeBetweenSummon = 500;
    feedToIncreaseSummonSpeed = 5;
    timeBetweenSummonChange = 200;
    timeBetweenSummon = 2000;
    numberHungryFish = 0;
    time = 0;
    numberDestroyed = 0;
    gameOver = false;
    wasFishFed = false;

    //set sizes for this window size
    characterWidth = (50 / 750) * (newWidth);
    characterHeight = characterWidth * (33 / 50);
    //set h and w hungry fish and the evil under fish
    hFishW = (40 / 750) * (newWidth);
    hFishH = hFishW * (32 / 40);
    //set for hit box 
    hitBoxL = (20 / 750) * (newWidth);
    //set for text
    eTextF = (15 / 750) * (newWidth);
    characterSpeed = (7 / 750) * (newWidth);

    addCharacter();
    //addMovement();
    startGameUpdate();
}

function addCharacter() {
    new newCharacter();
}

class newCharacter {
    topToGHeight = null;
    leftToGWidth = null;
    innerCharacter = null;
    constructor() {
        this.innerCharacter = document.createElement("div");
        this.innerCharacter.classList.add("character");
        this.innerCharacter.style.width = characterWidth + "px";
        this.innerCharacter.style.height = characterHeight + "px";
        //center fish
        this.innerCharacter.style.top = (newHeight / 2) - (characterHeight / 2) + 'px';
        this.innerCharacter.style.left = ((newWidth) / 2) - (characterWidth / 2) + "px";
        gameElements.appendChild(this.innerCharacter);
        characterCSS = window.getComputedStyle(this.innerCharacter);
        character = this.innerCharacter;
    }
}

function startGameUpdate() {
    const updateInterval = setInterval(function () {
        time += timeIncrement;
        updateCharacter();
        updateFish();
        if (gameOver) {
            clearInterval(updateInterval);
            endGame();
        }
        //decrease time between summon check necessary so it doesn't keep decreasing
        if (timeBetweenSummon > minimumTimeBetweenSummon && numberDestroyed % feedToIncreaseSummonSpeed == 0 && wasFishFed) {
            wasFishFed = false;
            timeBetweenSummon -= timeBetweenSummonChange;
        }
        if (time % timeBetweenSummon == 0) {
            if (soundOn)
                sfx.pop.play();
            new fish();
        }
    }, timeIncrement);
}


class enemy {
    lifeTime = 0;
    text = null;
    hitBox = null;
    newMain = null;
    evilUnder = null;
    constructor() {
        this.hitBox = document.createElement("div");
        this.hitBox.classList.add("hitBox");
        this.hitBox.style.width = hitBoxL + "px";
        this.hitBox.style.height = hitBoxL + "px";
        this.text = document.createElement("div");
        this.text.innerHTML = "5";
        this.text.classList.add("enemyText");
        this.text.style.fontSize = eTextF + "px";
        this.text.style.fontWeight = "bold";
    }

    getLifeTime = function () {
        return this.lifeTime;
    }
    addToLifeTime = function (change) {
        this.lifeTime += change;
    }
    setText = function (text) {
        this.text.innerHTML = text;
    }
}

class fish extends enemy {
    constructor() {
        super();

        this.evilUnder = document.createElement("div");
        this.evilUnder.classList.add("evilFish");
        this.evilUnder.style.width = hFishW + "px";
        this.evilUnder.style.height = hFishH + "px";
        this.evilUnder.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281801/fishyfeederres/redFish.png\")";
        this.newMain = document.createElement("div");
        this.newMain.classList.add("hungryFish");
        this.newMain.style.width = hFishW + "px";
        this.newMain.style.height = hFishH + "px";
        var colorChange = Math.random();
        if (colorChange < 0.33) {
            this.newMain.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281800/fishyfeederres/purpleFish.png\")";
        } else if (colorChange > 0.66) {
            this.newMain.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281799/fishyfeederres/greenFish.png\")";
        } else {
            this.newMain.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281799/fishyfeederres/blueFish.png\")";
        }

        this.text.style.width = hFishW + 'px';
        this.text.style.height = hFishH + 'px';
        //creates the countdown on the fish
        //the order from bottom to top
        gameElements.appendChild(this.hitBox);
        gameElements.appendChild(this.evilUnder);
        gameElements.appendChild(this.newMain);
        gameElements.appendChild(this.text);

        var margLeft = parseInt(Math.random() * (95));
        var margTop = parseInt(Math.random() * 50);

        this.newMain.style.marginLeft = margLeft + "%";
        this.newMain.style.marginTop = margTop + "%";
        this.evilUnder.style.marginLeft = margLeft + "%";
        this.evilUnder.style.marginTop = margTop + "%";
        var shiftW = 10 * hFishW / parseInt(game.style.width);
        var shiftH = 10 * hFishH / parseInt(game.style.height);
        this.hitBox.style.marginLeft = margLeft + shiftW + "%";
        this.hitBox.style.marginTop = margTop + shiftH + "%";
        this.text.style.marginLeft = margLeft + "%";
        this.text.style.marginTop = margTop + shiftH + "%";

        for (var i = 0; i < hungryFish.length; i++) {
            reposIfCollide(this, hungryFish[i]);
        }

        hungryFish[numberHungryFish] = this;
        numberHungryFish++;
    }
}

function reposIfCollide(newEnemy, existingEnemy) {
    newRect = newEnemy.hitBox.getBoundingClientRect();
    existRect = existingEnemy.hitBox.getBoundingClientRect();
    //make a new div that is the hit box all of these have to be false
    while (!(newRect.top > existRect.bottom || newRect.right < existRect.left || newRect.bottom < existRect.top || newRect.left > existRect.right)) {
        var margLeft = parseInt(Math.random() * 95);
        var margTop = parseInt(Math.random() * 50);
        newEnemy.newMain.style.marginLeft = margLeft + "%";
        newEnemy.newMain.style.marginTop = margTop + "%";
        newEnemy.evilUnder.style.marginLeft = margLeft + "%";
        newEnemy.evilUnder.style.marginTop = margTop + "%";
        newEnemy.hitBox.style.marginLeft = margLeft + 1 + "%";
        newEnemy.hitBox.style.marginTop = margTop + 1 + "%";
        newEnemy.text.style.marginLeft = margLeft + "%";
        newEnemy.text.style.marginTop = margTop + 1 + "%";

        newRect = newEnemy.hitBox.getBoundingClientRect();
    }

}

function updateFish() {
    var i = 0;
    //each updateFish call run the if once
    var wasCollision = false;
    while (i < hungryFish.length) {
        //do this only once
        if (collide(hungryFish[i])) {
            if (soundOn) {
                sfx.fed.play();
            }
            fadeOutFish(hungryFish[i]);
            hungryFish[i].newMain.style.animation = "null";
            hungryFish.splice(i, 1);
            numberHungryFish--;
            numberDestroyed++;
            document.getElementById("currentScore").innerHTML = "Score: " + numberDestroyed;
            wasFishFed = true;
            wasCollision = true;
        }
        else {
            hungryFish[i].addToLifeTime(timeIncrement);
            switch (hungryFish[i].getLifeTime()) {
                case 1000:
                    hungryFish[i].setText("4");
                    break;
                case 2000:
                    hungryFish[i].setText("3");
                    break;
                case 3000:
                    hungryFish[i].setText("2");
                    break;
                case 4000:
                    hungryFish[i].setText("1");
                    break;
                case 4500:
                    hungryFish[i].setText("0.5");
                    break;
                case 4600:
                    hungryFish[i].setText("0.4");
                    break;
                case 4700:
                    hungryFish[i].setText("0.3");
                    break;
                case 4800:
                    hungryFish[i].setText("0.2");
                    break;
                case 4900:
                    hungryFish[i].setText("0.1");
                    break;
                case 5000:
                    gameElements.removeChild(hungryFish[i].newMain);
                    gameElements.removeChild(hungryFish[i].text);
                    gameElements.removeChild(hungryFish[i].hitBox);
                    moveToCenter(hungryFish[i].evilUnder);
                    gameOver = true;
                    break;
            }
        }
        i++;
    }
}


function collide(currentFish) {
    fishRect = currentFish.hitBox.getBoundingClientRect();
    charRect = character.getBoundingClientRect();
    //make a new div that is the hit box

    //make this hitbox work better with diagonal
    //if the top is above the bottom return false
    //if any are true return false
    /*
    c= document.createElement("div");
    c.style.top = charRect.top + 'px';
    c.style.bottom = charRect.bottom + 'px';
    c.style.left = charRect.left + 'px';
    c.style.left = charRect.left + 'px';
    c.style.width = characterWidth;
    c.style.height = characterHeight;
    c.style.backgroundColor = "red";
    c.style.display = "inline";
    c.style.position = "relative";
    gameElements.appendChild(c);
    */

    return !(
        charRect.top > fishRect.bottom ||
        charRect.right < fishRect.left ||
        charRect.bottom < fishRect.top ||
        charRect.left > fishRect.right
    );
}

function fadeOutFish(fish) {
    var op = 1;  // initial opacity
    gameElements.removeChild(fish.hitBox);
    gameElements.removeChild(fish.evilUnder);
    var fader = setInterval(function () {
        if (op <= 0.1) {
            clearInterval(fader);
            gameElements.removeChild(fish.newMain);
            gameElements.removeChild(fish.text);
        }
        fish.newMain.style.opacity = op;
        op -= 0.1;
    }, 25);
}

function updateCharacter() {
    var x = 0;
    var y = 0;
    //issue with keyboards some can't handle w then s or s then w and then a or d being pressed.
    //Instead of the up and down cancelling out and the character moving right or left
    //the character doesn't move at all 
    if (pressed["w"] || pressed["arrowup"]) {
        y++;
    }
    if (pressed["s"] || pressed["arrowdown"]) {
        y--;
    }
    if (pressed["d"] || pressed["arrowright"]) {
        x++;
    }
    if (pressed["a"] || pressed["arrowleft"]) {
        x--;
    }
    //change orientation of chracter
    if (x > 0 && y > 0) {
        character.style.transform = "rotate(315deg)";
        moveUp();
        moveRight();
    }
    else if (x < 0 && y > 0) {
        character.style.transform = "scaleX(-1) rotate(315deg)"
        moveUp();
        moveLeft();
    }
    else if (x > 0 && y < 0) {
        character.style.transform = "rotate(45deg)"
        moveDown();
        moveRight();
    }
    else if (x < 0 && y < 0) {
        character.style.transform = "scaleX(-1) rotate(45deg)";
        moveDown();
        moveLeft();
    }
    else if (x > 0) {
        character.style.transform = "rotate(0deg)";
        moveRight();
    }
    else if (x < 0) {
        character.style.transform = "scaleX(-1)";
        moveLeft();
    }
    else if (y > 0) {
        character.style.transform = "rotate(270deg)";
        moveUp();
    }
    else if (y < 0) {
        character.style.transform = "rotate(90deg)";
        moveDown();
    }
};

//these top/left are defind relative to game div
function moveLeft() {
    if (parseInt(characterCSS.getPropertyValue("left")) >= parseInt(game.style.borderWidth)) {
        character.style.left = parseInt(characterCSS.getPropertyValue("left")) - characterSpeed + "px";
    }
}

function moveRight() {
    if (parseInt(characterCSS.getPropertyValue("left")) + characterWidth <= (newWidth) - parseInt(game.style.borderWidth)) {
        character.style.left = parseInt(characterCSS.getPropertyValue("left")) + characterSpeed + "px";
    }
}

function moveUp() {
    if (parseInt(characterCSS.getPropertyValue("top")) + 2 * characterHeight >= parseInt(game.style.borderWidth)) {
        character.style.top = parseInt(characterCSS.getPropertyValue("top")) - characterSpeed + "px";
    }
}

function moveDown() {
    if (parseInt(characterCSS.getPropertyValue("top")) - 8 * characterHeight <= (parseInt(game.style.borderWidth))) {
        character.style.top = parseInt(characterCSS.getPropertyValue("top")) + characterSpeed + "px";
    }
}
/*
function moveUp() {
    console.log(characterCSS.getPropertyValue("top"));
    if (parseInt(characterCSS.getPropertyValue("top")) + (parseInt(characterCSS.height)) >= 3 * parseInt(game.style.borderWidth)) {
        character.style.top = parseInt(characterCSS.getPropertyValue("top")) - characterSpeed + "px";
    }
}
function moveDown() {
    if (parseInt(characterCSS.getPropertyValue("top")) + (2 * parseInt(characterCSS.height)) <= (newHeight) - (2 * parseInt(game.style.borderWidth))) {
        character.style.top = parseInt(characterCSS.getPropertyValue("top")) + characterSpeed + "px";
    }
}
*/


function endGame() {
    setTimeout(function () {
        if (soundOn)
            sfx.eaten.play();
    }, 500);
    setTimeout(function () { //this happends after one second
        //remove all child
        startButton.style.display = "inline";
        game.style.animation = "";
        startButton.style.top = "65%";
        document.getElementById("beginResult").style.display = "flex";
        displayNumbers();
        document.getElementById("endResult").style.display = "flex";
        game.style.backgroundImage = "var(--bg_1)";
        addHighScores();
        loadScores();
    }, 2500);
    //this time is the time to move to center + 1s which is time to move fish to center
    //plus a break of half a second
}

function addHighScores() {
    //code here
    var hScores = [localStorage.getItem('hs1'), localStorage.getItem('hs2'), localStorage.getItem('hs3')];
    if (hScores[0] == null) {
        localStorage.setItem('hs1', numberDestroyed.toString());
        return;
    }
    if (hScores[1] == null) {
        if (numberDestroyed >= parseInt(localStorage.getItem('hs1'))) {
            localStorage.setItem('hs2', localStorage.getItem('hs1'));
            localStorage.setItem('hs1', numberDestroyed.toString());
        } else
            localStorage.setItem('hs2', numberDestroyed.toString());
        return;
    }
    if (hScores[2] == null) {
        if (numberDestroyed >= parseInt(localStorage.getItem('hs1'))) {
            localStorage.setItem('hs3', localStorage.getItem('hs2'));
            localStorage.setItem('hs2', localStorage.getItem('hs1'));
            localStorage.setItem('hs1', numberDestroyed.toString());
        } else if (numberDestroyed >= parseInt(localStorage.getItem('hs2'))) {
            localStorage.setItem('hs3', localStorage.getItem('hs2'));
            localStorage.setItem('hs2', numberDestroyed.toString());
        }
        else {
            localStorage.setItem('hs3', numberDestroyed.toString());
        }
        return;
    }
    //only reach here if all previous hscores were filled
    //third high score
    if (numberDestroyed <= parseInt(hScores[2]))
        return;
    if (numberDestroyed > parseInt(hScores[2]) && numberDestroyed <= parseInt(hScores[1])) {
        localStorage.setItem('hs3', numberDestroyed.toString());
        return;
    }
    //second high score
    if (numberDestroyed > parseInt(hScores[1]) && numberDestroyed <= parseInt(hScores[0])) {
        localStorage.setItem('hs3', localStorage.getItem('hs2'));
        localStorage.setItem('hs2', numberDestroyed.toString());
        return;
    }
    //new highest score
    if (numberDestroyed > parseInt(hScores[0])) {
        localStorage.setItem('hs3', localStorage.getItem('hs2'));
        localStorage.setItem('hs2', localStorage.getItem('hs1'));
        localStorage.setItem('hs1', numberDestroyed.toString());
        return;
    }
}

function loadScores() {
    console.log("here");
    var scores = document.getElementById("highScores");
    if (localStorage.getItem('hs1') == null) {
        return;
    }
    if (localStorage.getItem('hs2') == null) {
        scores.innerHTML = "<p>Your High Scores:</p>1. " + localStorage.getItem('hs1') + "<br>2.<br>3.";
        return;
    }
    if (localStorage.getItem('hs3') == null) {
        scores.innerHTML = "<p>Your High Scores:</p>1. " + localStorage.getItem('hs1') + "<br>2. " + localStorage.getItem('hs2') + "<br>3.";
        return;
    }
    scores.innerHTML = "<p>Your High Scores:</p>1. " + localStorage.getItem('hs1') + "<br>2. " + localStorage.getItem('hs2') + "<br>3. " + localStorage.getItem('hs3');
}

function moveToCenter(evilFish) {
    //put margLeft to 50
    //put margTop to 25
    var changeLeft = (50 - parseInt(evilFish.style.marginLeft)) / 15;
    var changeTop = (25 - parseInt(evilFish.style.marginTop)) / 15;
    var count = 0;
    var numberMoves = 15;

    //make it face correct way
    if (parseInt(evilFish.style.marginLeft) < 50) {
        evilFish.style.transform = "rotateY(180deg)";
    }

    const moveToCenter = setInterval(function () {
        count++;

        evilFish.style.marginLeft = parseFloat(evilFish.style.marginLeft) + changeLeft + "%";
        evilFish.style.marginTop = parseFloat(evilFish.style.marginTop) + changeTop + "%";

        if (count == numberMoves) {
            //remove all child for fish
            var child = gameElements.lastElementChild;
            while (child) {
                gameElements.removeChild(child);
                child = gameElements.lastElementChild;
            }
            game.style.animation = "getConsumed 1s forwards ease-in-out";
            clearInterval(moveToCenter);
        }
    }, 50);
}

function displayNumbers() {
    //make these all into background images
    var numberW = (45 / 750) * (newWidth);
    var numberH = (90 / 750) * (newWidth);

    var changeConstX = (50 / 750) * (newWidth);
    var changeConstY = (-90 / 400) * newHeight;
    var transX = (265 / 750) * (newWidth);
    var transY = (-130 / 750) * (newWidth);

    number1 = document.getElementById("number1");
    number1.style.width = numberW + "px";
    number1.style.height = numberH + "px";
    number1.style.transform = "translate(" + transX + "px, " + transY + "px)";
    number1.style.backgroundSize = "100%";
    number1.style.backgroundRepeat = "no-repeat";
    number1.style.display = "flex";

    transX = transX + changeConstX;
    transY = transY + changeConstY;
    number2 = document.getElementById("number2");
    number2.style.width = numberW + "px";
    number2.style.height = numberH + "px";
    number2.style.transform = "translate(" + transX + "px, " + transY + "px)";
    number2.style.backgroundSize = "100%";
    number2.style.backgroundRepeat = "no-repeat";
    number2.style.display = "flex";

    transX = transX + changeConstX;
    transY = transY + changeConstY;
    number3 = document.getElementById("number3");
    number3.style.width = numberW + "px";
    number3.style.height = numberH + "px";
    number3.style.transform = "translate(" + transX + "px, " + transY + "px)";
    number3.style.backgroundSize = "100%";
    number3.style.backgroundRepeat = "no-repeat";
    number3.style.display = "flex";


    //this check is to move the "fishes, nice" to the right
    //fix this later to look better

    var hundreds = Math.floor(numberDestroyed / 100 % 10);
    var tens = Math.floor(numberDestroyed / 10 % 10);
    var ones = Math.floor(numberDestroyed % 10);

    var check = 0;
    if (hundreds != 0)
        check = 3;
    else if (tens != 0)
        check = 2;
    else
        check = 1;

    if (check == 3)
        document.getElementById("endResult").style.transform = "translate(150%, -500%)";
    if (check == 2)
        document.getElementById("endResult").style.transform = "translate(132%, -500%)";
    //document.getElementById("endResult").style.transform = "translate(" + leftShift2 + "%, -170%);"
    if (check == 1)
        document.getElementById("endResult").style.transform = "translate(112%, -500%)";

    //put the first number in number one
    //this only works for score up to 999
    switch (hundreds) {
        case 0:
            break;
        case 1:
            number1.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281800/fishyfeederres/numbers/one.png\")";
            break;
        case 2:
            number1.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281800/fishyfeederres/numbers/two.png\")";
            break;
        case 3:
            number1.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281800/fishyfeederres/numbers/three.png\")";
            break;
        case 4:
            number1.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281800/fishyfeederres/numbers/four.png\")";
            break;
        case 5:
            number1.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281800/fishyfeederres/numbers/five.png\")";
            break;
        case 6:
            number1.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281800/fishyfeederres/numbers/six.png\")";
            break;
        case 7:
            number1.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281800/fishyfeederres/numbers/seven.png\")";
            break;
        case 8:
            number1.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281799/fishyfeederres/numbers/eight.png\")";
            break;
        case 9:
            number1.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281800/fishyfeederres/numbers/nine.png\")";
            break;
    }
    switch (tens) {
        case 0:
            if (hundreds != 0)
                number2.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281800/fishyfeederres/numbers/zero.png\")";
            break;
        case 1:
            if (hundreds != 0)
                number2.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281800/fishyfeederres/numbers/one.png\")";
            else
                number1.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281800/fishyfeederres/numbers/one.png\")";
            break;
        case 2:
            if (hundreds != 0)
                number2.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281800/fishyfeederres/numbers/two.png\")";
            else
                number1.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281800/fishyfeederres/numbers/two.png\")";
            break;
        case 3:
            if (hundreds != 0)
                number2.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281800/fishyfeederres/numbers/three.png\")";
            else
                number1.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281800/fishyfeederres/numbers/three.png\")";
            break;
        case 4:
            if (hundreds != 0)
                number2.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281800/fishyfeederres/numbers/four.png\")";
            else
                number1.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281800/fishyfeederres/numbers/four.png\")";
            break;
        case 5:
            if (hundreds != 0)
                number2.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281800/fishyfeederres/numbers/five.png\")";
            else
                number1.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281800/fishyfeederres/numbers/five.png\")";
            break;
        case 6:
            if (hundreds != 0)
                number2.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281800/fishyfeederres/numbers/six.png\")";
            else
                number1.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281800/fishyfeederres/numbers/six.png\")";
            break;
        case 7:
            if (hundreds != 0)
                number2.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281800/fishyfeederres/numbers/seven.png\")";
            else
                number1.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281800/fishyfeederres/numbers/seven.png\")";
            break;
        case 8:
            if (hundreds != 0)
                number2.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281799/fishyfeederres/numbers/eight.png\")";
            else
                number1.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281799/fishyfeederres/numbers/eight.png\")";
            break;
        case 9:
            if (hundreds != 0)
                number2.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281800/fishyfeederres/numbers/nine.png\")";
            else
                number1.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281800/fishyfeederres/numbers/nine.png\")";
            break;
    }
    switch (ones) {
        case 0:
            //this means that there is a hundreds and tens value
            if (hundreds != 0)
                number3.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281800/fishyfeederres/numbers/zero.png\")";
            else if (tens != 0)
                number2.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281800/fishyfeederres/numbers/zero.png\")";
            else
                number1.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281800/fishyfeederres/numbers/zero.png\")";
            break;
        case 1:
            if (hundreds != 0)
                number3.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281800/fishyfeederres/numbers/one.png\")";
            else if (tens != 0)
                number2.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281800/fishyfeederres/numbers/one.png\")";
            else
                number1.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281800/fishyfeederres/numbers/one.png\")";
            break;
        case 2:
            if (hundreds != 0)
                number3.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281800/fishyfeederres/numbers/two.png\")";
            else if (tens != 0)
                number2.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281800/fishyfeederres/numbers/two.png\")";
            else
                number1.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281800/fishyfeederres/numbers/two.png\")";
            break;
        case 3:
            if (hundreds != 0)
                number3.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281800/fishyfeederres/numbers/three.png\")";
            else if (tens != 0)
                number2.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281800/fishyfeederres/numbers/three.png\")";
            else
                number1.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281800/fishyfeederres/numbers/three.png\")";
            break;
        case 4:
            if (hundreds != 0)
                number3.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281800/fishyfeederres/numbers/four.png\")";
            else if (tens != 0)
                number2.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281800/fishyfeederres/numbers/four.png\")";
            else
                number1.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281800/fishyfeederres/numbers/four.png\")";
            break;
        case 5:
            if (hundreds != 0)
                number3.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281800/fishyfeederres/numbers/five.png\")";
            else if (tens != 0)
                number2.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281800/fishyfeederres/numbers/five.png\")";
            else
                number1.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281800/fishyfeederres/numbers/five.png\")";
            break;
        case 6:
            if (hundreds != 0)
                number3.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281800/fishyfeederres/numbers/six.png\")";
            else if (tens != 0)
                number2.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281800/fishyfeederres/numbers/six.png\")";
            else
                number1.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281800/fishyfeederres/numbers/six.png\")";
            break;
        case 7:
            if (hundreds != 0)
                number3.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281800/fishyfeederres/numbers/seven.png\")";
            else if (tens != 0)
                number2.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281800/fishyfeederres/numbers/seven.png\")";
            else
                number1.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281800/fishyfeederres/numbers/seven.png\")";
            break;
        case 8:
            if (hundreds != 0)
                number3.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281799/fishyfeederres/numbers/eight.png\")";
            else if (tens != 0)
                number2.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281799/fishyfeederres/numbers/eight.png\")";
            else
                number1.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281799/fishyfeederres/numbers/eight.png\")";
            break;
        case 9:
            if (hundreds != 0)
                number3.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281800/fishyfeederres/numbers/nine.png\")";
            else if (tens != 0)
                number2.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281800/fishyfeederres/numbers/nine.png\")";
            else
                number1.style.backgroundImage = "url(\"https://res.cloudinary.com/dmr8ozkfj/image/upload/v1652281800/fishyfeederres/numbers/nine.png\")";
            break;
    }
}




