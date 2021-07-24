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
  isVisible: true
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
  width: 80,
  height: 10,
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
  ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
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
      ctx.fillStyle = brick.isVisible ? '#0095dd' : 'transparent';
      ctx.fill();
      ctx.closePath();
    })
  });
}

// Move paddle on canvas
function movePaddle() {
  paddle.x += paddle.dx;

  // Wall collision detection
  if (paddle.x + paddle.width > canvas.width) {
    paddle.x = canvas.width - paddle.width;
  }

  if (paddle.x < 0) {
    paddle.x = 0;
  }
}

// Move ball on canvas
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Wall collision detection
  // if ball hits right or left wall reverse its direction
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1;
  }

  // if ball hits top or bottom wall reverse its direction
  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
    ball.dy *= -1;
  }

  // Paddle collision
  if (
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.width &&
    ball.y + ball.size > paddle.y) {
    ball.dy = -ball.speed;
  }

  // Brick collision
  bricks.forEach(col => {
    col.forEach(brick => {
      if (brick.isVisible) {
        if (
          ball.x - ball.size > brick.x && // (left side)
          ball.x + ball.size < brick.x + brick.width && // (right side)
          ball.y + ball.size > brick.y && // (top)
          ball.y - ball.size < brick.y + brick.height // (bottom)
        ) {
          ball.dy *= -1;
          brick.isVisible = false;

          increaseScore();
        }
      }
    });
  });

  // Hit bottom wall - lose
  if (ball.y + ball.size > canvas.height) {
    showAllBricks();
    score = 0;
  }

}

// Increase Score
function increaseScore() {
  score++;
  if (score % (brickRowCount * brickRowCount) === 0) {
    showAllBricks();
  }
}

// Make all bricks appear
function showAllBricks() {
  bricks.forEach(col => {
    col.forEach(brick => (brick.isVisible = true));
  });
}

// Draw everything
function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPaddle();
  drawBall();
  drawScore();
  drawBricks();
}

// Update canvas drawing and animation using window.requestAnimationFrame
function update() {
  movePaddle();
  moveBall();

  // Draw the game 
  draw();

  requestAnimationFrame(update);
}

update();

// Keydown event 
function keyDown(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    paddle.dx = paddle.speed;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    paddle.dx = -paddle.speed;
  }
}

function keyUp(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'Left' || e.key === 'ArrowLeft') {
    paddle.dx = 0;
  }
}

// Keyboard event handlers
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

// Rules and close event handlers
rulesBtn.addEventListener('click', () => rules.classList.add('show'));
closeBtn.addEventListener('click', () => rules.classList.remove('show'));