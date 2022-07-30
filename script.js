var difficulty = parseInt(prompt("Select Difficulty (Type a number): "));
if (Number.isInteger(difficulty) == false) {
    difficulty = 6;
}
var windowWidth = window.screen.width;
var windowHeight = window.screen.height;
var gameStarted = false;
var timeToMemorize = Math.round(difficulty / 2);
var curCountDown = timeToMemorize;
var curMode = "";
var curNumSlots = [];
var timerStarted = false;
var timer;
var timerMakeMove = false;
var curGraySection = 1;
var mouseY;
var playHoleAnimation = false;
var holeDistAway = 0;
var timerId;
var curScore = 0;
var restartingCount = 4;
var restartingTimer;
var alreadyRestarting = false;
var scoreAdded = false;
var curGuyStatus = "stand";

function screenSizeUpdated() {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
}

function generateNumSlots() {
    for (let i = 0; i < difficulty; i += 1) {
        curNumSlots.push(Math.floor(Math.random() * difficulty) + 1);
    }
}

function updateCountDown() {
    if (curCountDown == 0) {
        curCountDown = timeToMemorize;
        if (timerMakeMove == true) {
            playHoleAnimation = true;
            document.getElementById("hole1").style.top = windowHeight / difficulty * (curNumSlots[0] - 1) + "px";
            document.getElementById("hole2").style.top = windowHeight / difficulty * (curNumSlots[0] - 1) + "px";
            clearInterval(timer);
            document.getElementById("countdown").textContent = "";
        } else if (curNumSlots.length == difficulty) {
            curMode = "gameMode";
            clearInterval(timer);
            timer = setInterval(updateCountDown, 1000);
            timerMakeMove = true;
            document.getElementById("curGameSign").textContent = "";
            timeToMemorize = 3;
            curCountDown = timeToMemorize;
        }
    }
    curCountDown -= 1;
}

function getCursorPosition(event) {
    if (curMode == "gameMode" && playHoleAnimation == false) {
        try {
            mouseY = Math.round((event.clientY - windowHeight / difficulty / 2) / windowHeight * difficulty);
            document.getElementById("line" + curGraySection).style.backgroundColor = "white";
            document.getElementById("line" + Math.round((event.clientY - windowHeight / difficulty / 2) / windowHeight * difficulty)).style.backgroundColor = "gray";
            curGraySection = Math.round((event.clientY - windowHeight / difficulty / 2) / windowHeight * difficulty);
        } catch (TypeError) {
            return;
        }
    }
}

function restartingGame() {
    restartingCount -= 1;
    document.getElementById("curGameSign").textContent = "Try Again in " + restartingCount + "...";
    if (restartingCount == 0) {
        curScore = 0;
        document.getElementById("yourScore").textContent = "Score: " + curScore;
        document.getElementById("character").style.display = "block";
        playHoleAnimation = false;
        holeDistAway = 0;
        timerStarted = false;
        timerMakeMove = false;
        curNumSlots = [];
        startGame();
        clearInterval(timer);
        clearInterval(timerId);
        timerId = setInterval(updateStuff, 50);
        clearInterval(restartingTimer);
    }
}

function updateStuff() {
    drawStuff(1);
    let character = document.getElementById("character");
    character.style.left = windowWidth * 0.2 + "px";
    character.style.top = 0 + "px";
    character.style.width = windowHeight / difficulty + "px";
    character.style.height = windowHeight / difficulty + "px";
    if (gameStarted == true) {
        if (curMode == "showingCards") {
            let curGameSign = document.getElementById("curGameSign");
            let curSignFontSize = parseInt(curGameSign.style.fontSize.slice(0, -2));
            if (curSignFontSize > 100) {
                curGameSign.style.fontSize = curSignFontSize - 15 + "px";
            } else {
                if (timerStarted == false) {
                    timerStarted = true;
                    timer = setInterval(updateCountDown, 1000);
                } else if (playHoleAnimation == false) {
                    document.getElementById("countdown").textContent = "In " + curCountDown + " seconds!!";
                }
            }
        } else if (curMode == "gameMode") {
            if (playHoleAnimation == true) {
                holeDistAway += 10;
                if (holeDistAway >= windowWidth + windowHeight / difficulty * 3) {
                    playHoleAnimation = false;
                    holeDistAway = 0;
                    scoreAdded = false;
                    curNumSlots.shift();
                    if (curNumSlots.length == 0) {
                        timerStarted = false;
                        timerMakeMove = false;
                        startGame();
                        clearInterval(timer);
                        clearInterval(timerId);
                        timerId = setInterval(updateStuff, 50);
                        return;
                    }
                    timer = setInterval(updateCountDown, 1000);
                    document.getElementById("hole1").style.top = windowHeight / difficulty * (curNumSlots[0] - 1) + "px";
                    document.getElementById("hole2").style.top = windowHeight / difficulty * (curNumSlots[0] - 1) + "px";
                }
            }
            document.getElementById("character").style.top = windowHeight / difficulty * mouseY + "px";
            if (playHoleAnimation == false) {
                document.getElementById("countdown").textContent = "Select the right slot in " + curCountDown + " seconds!!";
                document.getElementById("curGameSign").textContent = "";
            } else if (holeDistAway >= windowWidth - windowWidth * 0.2) {
                if (holeDistAway - windowHeight / difficulty * 2 >= windowWidth - windowWidth * 0.2 && windowHeight / difficulty * mouseY == windowHeight / difficulty * (curNumSlots[0] - 1)) {
                    character.style.display = "block";
                    document.getElementById("curGameSign").textContent = "Nice Job! Continue By Guessing The Following Slots Correctly!"
                    if (scoreAdded == false) {
                        curScore += 1;
                        document.getElementById("yourScore").textContent = "Score: " + curScore;
                        scoreAdded = true;
                    }
                } else {
                    if (windowHeight / difficulty * mouseY != windowHeight / difficulty * (curNumSlots[0] - 1) && alreadyRestarting == false) {
                        if (alreadyRestarting == true) {
                            alreadyRestarting = false;
                            restartingCount = 4;
                            return;
                        } else {
                            alreadyRestarting = true;
                            document.getElementById("curGameSign").textContent = "You Picked The Wrong Slot, and Ran Into Spikes!";
                            restartingTimer = setInterval(restartingGame, 1000);
                        }
                    } else {
                        character.style.display = "none";
                    }
                }
            }
        }
    }
}

function startGame() {
    document.getElementById("curGameSign").onmouseup = null;
    gameStarted = true;
    curMode = "showingCards";
    document.getElementById("curGameSign").style.backgroundColor = "";
    generateNumSlots();
    document.getElementById("curGameSign").style.fontSize = windowHeight / 2 + "px";
    document.getElementById("curGameSign").textContent = "Memorize These Slots: " + curNumSlots.toString().replaceAll(",", ", ");
}

function drawStuff(countDone) {
    let curLine;
    let curNum;
    let spikes;
    let hole1 = document.getElementById("hole1");
    let hole2 = document.getElementById("hole2");
    hole1.style.left = windowWidth - holeDistAway + "px";
    hole1.style.width = windowHeight / difficulty + "px";
    hole1.style.height = windowHeight / difficulty + "px";
    hole1.style.borderRadius = windowHeight / difficulty / 2 + "px";
    
    hole2.style.left = windowWidth - holeDistAway + windowHeight / difficulty * 2 + "px";
    hole2.style.width = windowHeight / difficulty + "px";
    hole2.style.height = windowHeight / difficulty + "px";
    hole2.style.borderRadius = windowHeight / difficulty / 2 + "px";
    for (let i = 0; i < difficulty; i += 1) {
        if (countDone == 0) {
            curLine = document.getElementById("game").appendChild(document.createElement("div"));
            curNum = document.getElementById("game").appendChild(document.createElement("h1"));
            spikes = document.getElementById("game").appendChild(document.createElement("img"));
        } else {
            curLine = document.getElementById("line" + i);
            curNum = document.getElementById("num" + i);
            spikes = document.getElementById("spikes" + i);
        }
        curLine.id = "line" + i;
        curLine.style.height = windowHeight / difficulty + "px";
        curLine.style.borderStyle = "solid";
        curLine.style.left = "0px";
        curLine.style.right = "0px";
        curLine.style.top = windowHeight / difficulty * i + "px";
        curLine.style.position = "absolute";
        
        curNum.id = "num" + i;
        curNum.style.position = "absolute";
        curNum.textContent = i + 1 + "";
        curNum.style.fontSize = windowHeight / (difficulty + (windowHeight / 127.75 + difficulty)) + "px";
        curNum.style.top = windowHeight / difficulty * i + "px";

        spikes.id = "spikes" + i;
        spikes.src = "imgs/spikes.png";
        spikes.style.position = "absolute";
        spikes.style.left = windowWidth - holeDistAway + "px";
        spikes.style.top = windowHeight / difficulty * i + "px";
        spikes.style.width = windowHeight / difficulty + "px"
        spikes.style.height = windowHeight / difficulty + "px"
    }
}

function guyStatus() {
    if (playHoleAnimation == false) {
        curGuyStatus = "stand";
        document.getElementById("character").src = "imgs/guyStand.png";
    } else {
        if (curGuyStatus == "run1") {
            curGuyStatus = "run2";
            document.getElementById("character").src = "imgs/guyRun2.png";
        } else {
            curGuyStatus = "run1";
            document.getElementById("character").src = "imgs/guyRun1.png";
        }
    }
}

function start() {
    screenSizeUpdated();
    window.onresize = screenSizeUpdated;
    drawStuff(0);
    timerId = setInterval(updateStuff, 50);
    setInterval(guyStatus, 200);
}

start();
