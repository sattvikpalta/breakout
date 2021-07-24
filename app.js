// Canvas API - https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');
const rules = document.getElementById('rules');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let score = 0;

const brickRowCount = 9;
const brickColCount = 5;

// Create ball props
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 10,
  speed: 4,
  // Direction speed on x and y axis
  dx: 4,
  dy: -4
};

// Create brick props
const brickInfo = {
  width: 70,
  height: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true
}

// Create bricks
const bricks = [];
for (let row = 0; row < brickRowCount; row++) {
  bricks[row] = [];
  for (let col = 0; col < brickColCount; col++) {
    const x = row * (brickInfo.width + brickInfo.padding) + brickInfo.offsetX;
    const y = col * (brickInfo.height + brickInfo.padding) + brickInfo.offsetY;
    bricks[row][col] = {
      x,
      y,
      ...brickInfo
    }
  }
}

// Create paddle props
const paddle = {
  x: canvas.width / 2 - 40, // Entire paddle width is 80, it's in the center so -40
  y: canvas.height - 20,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0
};

// Draw ball on canvas - Canvas API -> Drawing shapes -> Moving the pen -> ctx.arc
function drawBall() {
  // Create a new path
  ctx.beginPath();
  // Make an outer circle
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = '#0095dd';
  ctx.fill();
  ctx.closePath();
}

// Draw paddle on canvas
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = '#0095dd';
  ctx.fill();
  ctx.closePath();
}

// Draw score on canvas
function drawScore() {
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}

// Draw bricks on canvas
function drawBricks() {
  bricks.forEach(col => {
    col.forEach(brick => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.width, brick.height);
      ctx.fillStyle = brick.visible ? '#0095dd' : 'transparent';
      ctx.fill();
      ctx.closePath();
    })
  });
}

// Draw everything
function draw() {
  drawPaddle();
  drawBall();
  drawScore();
  drawBricks();
}

// Draw the game 
draw();

// Rules and close event handlers
rulesBtn.addEventListener('click', () => rules.classList.add('show'));
closeBtn.addEventListener('click', () => rules.classList.remove('show'));