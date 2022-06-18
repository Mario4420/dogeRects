function randomNumber(min, max){
    return Math.floor(Math.random()*(max-min) + min);
    // 0.6 * (25-15) + 15
    // 0.6 * 10 + 15
    // 6 + 15 = 21
}


function getRandomColor() {
    let color = "#";
    let hexDigits = "0123456789ABCDEF";

    for(let i = 0; i < 6; i++) {
        color += hexDigits[Math.floor(Math.random() * hexDigits.length)];
    }

    return color;
}


function spawnEnemies(enemies, amt) {
    for(let i = 0; i < amt; i++) {
        enemies.push({
            x:      Math.random() * -100,
            y:      Math.random() * canvas.height,
            size:   25,
            speed:  randomNumber(10, 15),
            color:  getRandomColor(),
        });
    }
}


// Solution 1: die hälfte der elemente werden durch das inkrementieren des index übersprungen 
//function removeEnemies(enemies, canvas) {
//    for(let i = 0; i < enemies.length; i++) {
//        if(enemies[i].x > canvas.width) {
//            enemies.splice(i, 1);
//        }
//    }
//}

// Solution 2: index wird nicht übersprungen dafür öfters wiederholt und gecheckt
//function removeEnemies(enemies, canvas) {
//    for(let i = enemies.length - 1; i >= 0; i--) {
//        if(enemies[i].x > canvas.width) {
//            enemies.splice(i, 1);
//            i--;
//        }
//    }
//}

//Solution 3: durchs rückwärts loopen wird kein element übersprungen (optimale solution)
function removeEnemies(enemies, canvas) {
    for(let i = enemies.length - 1; i >= 0; i--) {
        if(enemies[i].x > canvas.width) {
            enemies.splice(i, 1);
            spawnEnemies(enemies, 1);
        }
    }
}


function drawEnemies(ctx, enemies) {
    for(let i = 0; i < enemies.length; i++){
        ctx.fillStyle = enemies[i].color;
        ctx.fillRect(
            enemies[i].x,
            enemies[i].y,
            enemies[i].size,
            enemies[i].size
        );
        ctx.fill();
    }
}

function moveEnemies(enemies) {
    for(let i = 0; i < enemies.length; i++) {
        enemies[i].x += enemies[i].speed;
    }
}


function rectRect(r1x, r1y, r1w, r1h, r2x, r2y, r2w, r2h) {

    // are the sides of one rectangle touching the other?
  
    if (r1x + r1w >= r2x &&    // r1 right edge past r2 left
        r1x <= r2x + r2w &&    // r1 left edge past r2 right
        r1y + r1h >= r2y &&    // r1 top edge past r2 bottom
        r1y <= r2y + r2h) {    // r1 bottom edge past r2 top
          return true;
    }
    return false;
}

function checkMouseRectCollision(enemies, mouseX, mouseY) {
    for(let i = 0; i < enemies.length; i++) {
        if(rectRect(
            enemies[i].x,
            enemies[i].y,
            enemies[i].size,
            enemies[i].size,
            mouseX,
            mouseY, 
            1,
            1
        )) {
            console.log("COLLISION");
            return true;
        }
    }
}


function main() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let score = 0;
    let enemies = [];
    const WAVE_AMT = 75;
    spawnEnemies(enemies, WAVE_AMT);
    let mouseX = 0;
    let mouseY = 0;

    let gameOverText = `Game Over! Score ${score}`;
    let gameOverTextPos = {
        x: 310,
        y: canvas.height / 2
    };

    canvas.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function loop() {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fill();


        moveEnemies(enemies);
        drawEnemies(ctx, enemies);
        removeEnemies(enemies, canvas);

        if(checkMouseRectCollision(enemies, mouseX, mouseY)) {
            ctx.font = `120px Arial`;            
            ctx.fillText(gameOverText, gameOverTextPos.x, gameOverTextPos.y); 
        }
        else {
            window.requestAnimationFrame(loop);
        }
        score++;
        gameOverText = `Game Over! Score: ${score}`;
    
        //window.requestAnimationFrame(loop);
    }
    window.requestAnimationFrame(loop);
}


main();