const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext("2d");
// we will need the gamecontainer to make it blurry
// when we display the end menu
const gameContainer = document.getElementById('game-container');

const raccoonImg = new Image();
raccoonImg.src = 'assets/racicon.png';

//Game constants
const JUMP_SPEED = -4;
const RAC_WIDTH = 40;
const RAC_HEIGHT = 30;
const TREE_WIDTH = 50;
const TREE_GAP = 125;

// Raccoon variables
let racX = 64;
let racY = 64;
let racVelocity = 0;
let racAcceleration = 0.1;

// Tree variables
let treeX = 600;
let treeY = canvas.height - 200;

// score and highscore variables
let scoreDiv = document.getElementById('score-display');
let score = 0;
let highScore = 0;

// we add a bool variable, so we can check when the raccoon passes we increase
// the value
let scored = false;

// lets us control the raccoon with the space key
document.body.onkeyup = function(e) {
    if (e.code == 'Space') {
        racVelocity = JUMP_SPEED;
    }
}

// lets us restart the game if we hit game-over
document.getElementById('restart-button').addEventListener('click', function() {
    hideEndMenu();
    resetGame();
    loop();
})



function increaseScore() {
    // increase now our counter when the raccoon passes the trees
    if(racX > treeX + TREE_WIDTH && 
        (racY < treeY + TREE_GAP || 
          racY + RAC_HEIGHT > treeY + TREE_GAP) && 
          !scored) {
        score++;
        scoreDiv.innerHTML = score;
        scored = true;
    }

    // reset the flag, if raccoon passes the trees
    if (racX < treeX + TREE_WIDTH) {
        scored = false;
    }
}

function collisionCheck() {
    // Create bounding boxes for the raccoon and the trees

    const racBox = {
        x: racX,
        y: racY,
        width: RAC_WIDTH,
        height: RAC_HEIGHT
    }

    const topTreeBox = {
        x: treeX,
        y: treeY - TREE_GAP + RAC_HEIGHT,
        width: TREE_WIDTH,
        height: treeY
    }

    const bottomTreeBox = {
        x: treeX,
        y: treeY + TREE_GAP + RAC_HEIGHT,
        width: TREE_WIDTH,
        height: canvas.height - treeY - TREE_GAP
    }

    // Check for collision with upper tree box
    if (racBox.x + racBox.width > topTreeBox.x &&
        racBox.x < topTreeBox.x + topTreeBox.width &&
        racBox.y < topTreeBox.y) {
            return true;
    }

    // Check for collision with lower tree box
    if (racBox.x + racBox.width > bottomTreeBox.x &&
        racBox.x < bottomTreeBox.x + bottomTreeBox.width &&
        racBox.y + racBox.height > bottomTreeBox.y) {
            return true;
    }

    // check if raccoon hits boundaries
    if (racY < 0 || racY + RAC_HEIGHT > canvas.height) {
        return true;
    }


    return false;
}

function hideEndMenu () {
    document.getElementById('end-menu').style.display = 'none';
    gameContainer.classList.remove('backdrop-blur');
}

function showEndMenu () {
    document.getElementById('end-menu').style.display = 'block';
    gameContainer.classList.add('backdrop-blur');
    document.getElementById('end-score').innerHTML = score;
    // This way we update always our highscore at the end of our game
    // if we have a higher high score than the previous
    if (highScore < score) {
        highScore = score;
    }
    document.getElementById('best-score').innerHTML = highScore;
}

// reset the values to the beginning so we start 
// with the raccoon at the beginning
function resetGame() {
    racX = 50;
    racY = 50;
    racVelocity = 0;
    racAcceleration = 0.1;

    treeX = 600;
    treeY = canvas.height - 200;

    score = 0;
}

function endGame() {
    showEndMenu();
}

function loop() {
    // reset the ctx after every loop iteration
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Raccoon
    ctx.drawImage(raccoonImg, racX, racY);

    // Draw Trees
    ctx.fillStyle = '#333';
    ctx.fillRect(treeX, -100, TREE_WIDTH, treeY);
    ctx.fillRect(treeX, treeY + TREE_GAP, TREE_WIDTH, canvas.height - treeY);

    // collision check to display our end-menu
    // and end the game
    // the collisionCheck will return us true if we have a collision
    // otherwise false
    if (collisionCheck()) {
        endGame();
        return;
    }


    // forgot to move the trees
    treeX -= 1.5;
    // if the tree moves out of the frame we need to reset the tree
    if (treeX < -50) {
        treeX = 600;
        treeY = Math.random() * (canvas.height - TREE_GAP) + TREE_WIDTH;
    }

    // apply gravity to the raccoon and let it move
    racVelocity += racAcceleration;
    racY += racVelocity;

    // always check if you call the function ...
    increaseScore()
    requestAnimationFrame(loop);
}

loop();