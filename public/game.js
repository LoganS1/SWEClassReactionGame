// Create the canvas and context
const canvas = document.getElementById("reactCanvas");
const ctx = canvas.getContext("2d");

// Game constant values
const tgt_radius = 20;
const num_tgts = 10;
const penalty_score = 1000;

// Important game variables
let x_pos = canvas.width / 2;
let y_pos = canvas.height / 2;
let penalty = 0;
let tgt_count = 0;
let seed = -1; // Default value indicates no seed set

var start_time, end_time;

// Function to set the seed of the RNG, if required
function setSeed() {
    seed = document.getElementById("roomBox").value;
    Math.seedrandom(seed);
    startGame()
}

// Set the starting conditions for the game and draw the first target
function startGame() {

    // Reset the game tracking related parameters
    x_pos = canvas.width / 2;
    y_pos = canvas.height / 2;
    penalty = 0;
    tgt_count = 0;

    drawTarget();
}

// Restart the game, and reseed if required
function restartGame() {

    // Reseed the RNG if seeded mode is used
    if (seed != -1) {
        Math.seedrandom(seed);
    }

    // Start the game
    startGame();
}


// Remove the pixels for the old position of the target
function clearTarget() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}


// Draw a circular target at (x_pos,y_pos)
function drawTarget() {
    clearTarget();
    ctx.beginPath();
    ctx.arc(x_pos, y_pos, tgt_radius, 0, Math.PI * 2);
    ctx.fillStyle = "gainsboro";
    ctx.fill();
    ctx.closePath();
}

// Find the distance between any two points in cartesian coordinates
function findDist(x1, y1, x2, y2) {
    let dx = x1 - x2;
    let dy = y1 - y2;
    let r = Math.sqrt(dx * dx + dy * dy);
    return r;
}

// Handles click events in the canvas
function clickHandler(e) {
    // If clicking inside the target
    if (findDist(x_pos, y_pos, e.offsetX, e.offsetY) <= tgt_radius) {
        // Generate new target coordinates, checking for OOB errors
        x_pos = Math.floor(Math.random() * (canvas.width - 2 * tgt_radius)) + tgt_radius;
        y_pos = Math.floor(Math.random() * (canvas.height - 2 * tgt_radius)) + tgt_radius;

        drawTarget();

        // If this is the first target
        if (tgt_count == 0) {
            // Grab the start time and set penalties to 0
            start_time = Date.now();
            penalty = 0;
        }
        // Increment the target counter
        tgt_count += 1;
        // If the total number of targets have been clicked
        if (tgt_count >= (num_tgts)) {
            // Get the end time
            end_time = Date.now();

            gameOver();
        }
    }
    // If the click is not on the target, add a penalty
    else {
        penalty += 1;
    }
}

// Handle the end of the game
function gameOver() {
    score = calcScore();
    alert("Game over, score is " + score);
    let sessionKey = getCookie("sessionKey");
    let saveScore = fetch('\saveScore', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({sessionKey, score})
    })
    restartGame();
}


// Calculate the player's score
function calcScore() {
    // Calculate the time difference
    let dt = end_time - start_time;
    // Add additional time for penalties
    score = dt + (penalty * penalty_score);
    return score;
}

// Get a cookie with a particular name
function getCookie(cname) {
    // Format the name of the cookie
    let name = cname + "=";
    // Create an array of cookie data
    let ca = document.cookie.split(';');
    // Go through the array
    for (let i = 0; i < ca.length; i++) {
        // Get an individual cookie
        let c = ca[i];
        // Remove leading spaces
        while (c.charAt(0) == ' ') {
         c = c.substring(1);
        }
        // Check if the name matches
        if (c.indexOf(name) == 0) {
            // Return the cookie data
            return c.substring(name.length, c.length);
        }
    }
    // Return an empty string
    return "";
}

// Add a click listener to the canvas
canvas.addEventListener("click", clickHandler, false);
// Start the game
startGame();