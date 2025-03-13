const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const gameContainer = document.getElementById("gameContainer");
const gameOverModal = document.getElementById("gameOverModal");
const audio = document.getElementById("audio1");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;
let snakeColor = "#d053db"; // Color inicial de la serpiente

//obtener puntuación alta (local storage)

let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `Punteggio alto: ${highScore}`;

const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

//pasar un aleatorio entre 1 y 30 como posición de comida

const updateFoodPosition = () =>{
    foodX = Math.floor(Math.random() * 20) + 1;
    foodY = Math.floor(Math.random() * 20) + 1;
}

/*const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert("Game Over! Pressiona Aceptar para volver a jugar...");
    location.reload();
}*/

//Boton jugar
document.getElementById("startButton").addEventListener("click", function() {
    // Mostrar el juego
    document.getElementById("gameContainer").style.display = "block";

    // Ocultar el botón
    document.querySelector(".container").style.display = "none";

    let audio = document.getElementById("audio1");
    audio.currentTime = 0;
    audio.play().catch(error => console.log("Error al reproducir música:", error));
});

//Boton reiniciar 
const handleGameOver = () => {
    clearInterval(setIntervalId);
    
    // Ocultar el tablero de juego
    document.getElementById("gameContainer").style.display = "none";

    // Mostrar el modal de Game Over
    document.getElementById("gameOverModal").style.display = "flex";

    // Mostrar la puntuación final
    document.getElementById("finalScore").innerText = score;
    
    let audio = document.getElementById("audio1");
    audio.pause();

    document.getElementById("restartButton").addEventListener("click", function() {
        document.getElementById("gameOverModal").style.display = "none"; // Ocultar modal
        document.querySelector(".container").style.display = "block"; // Mostrar botón "Jugar"
        location.reload();
    });
    
};

//cambiar el valor de velocidad según la pulsación de una tecla

const changeDirection = e => {
    if (e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

//cambiar de dirección en cada clic de tecla

controls.forEach(button => button.addEventListener("click",() => changeDiretion({key: button.dataset.key})));

const initGame = () => {
    if (gameOver) return handleGameOver();
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;
    
    //cuando la serpiente come la comida

    if (snakeX === foodX && snakeY === foodY){
        updateFoodPosition();
        snakeBody.push([foodY, foodX]); // agregar comida al conjunto del cuerpo de la serpiente
        score++;
        highScore = score >= highScore ? score : highScore; // if score > high score => high score = score 
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Puntatura: ${score}`;
        highScoreElement.innerText =`Punteggio alto: ${highScore}`;
        snakeColor = getRandomColor(); // Cambia el color de la serpiente
    }

    //actualizar cabeza de serpiente

    snakeX += velocityX;
    snakeY += velocityY;

    //Desplazar hacia adelante los valores de los elementos en el cuerpo de la serpiente en uno

    for(let i = snakeBody.length - 1; i > 0; i--){
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX, snakeY];

    //Verifique que el cuerpo de la serpiente esté fuera de la pared o no.

    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30){
        return gameOver = true;
    }

    //Dibujar la serpiente con el color actual
    for (let i = 0; i < snakeBody.length; i++) {
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}; background-color: ${snakeColor};"></div>`;
        
        // Verificar si la cabeza colisiona con el cuerpo
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }

    /*//agrega div for each parte del cuerpo de la serpiente

    for(let i = 0; i < snakeBody.length; i++){
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        
        //Verifique que la cabeza de serpiente haya golpeado el cuerpo o no

        if(i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]){
            gameOver = true;
        }
    }*/

    playBoard.innerHTML = html;
}

updateFoodPosition();
setIntervalId = setInterval(initGame, 100);
document.addEventListener("keyup", changeDirection);
