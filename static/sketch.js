const socket = io.connect("http://localhost:5000"); // Adjust to your server address

let startingHues = [
  [227, 75, 14, 5], //  --penn-blue: hsla(227, 75%, 14%, 1);
  [228, 100, 73, 5], //  --cornflower-blue: hsla(228, 100%, 73%, 1);
  [210, 89, 83, 5], //  --uranian-blue: hsla(210, 89%, 83%, 1);
  [225, 39, 39, 5], //  --yinmn-blue: hsla(225, 39%, 39%, 1);
  [234, 75, 43, 5], //  --persian-blue: hsla(234, 75%, 43%, 1)
];

let yellowBlast = [
  [354, 14, 42, 1],
  [48, 31, 50, 1],
  [38, 58, 64, 1],
  [47, 92, 74, 1],
  [48, 76, 79, 1],
];

let brightCols = [
  [211, 87, 25, 1],
  [60, 37, 87, 1],
  [345, 67, 55, 1],
  [47, 87, 66, 1],
  [14, 90, 68, 1],
];

let anotherPalette = [
  [14, 77, 54, 1],
  [179, 78, 42, 1],
  [46, 100, 54, 1],
  [340, 7, 17, 1],
  [91, 46, 47, 1],
];

const FPS = 90;
const ballPopupDifference = 3;

let darkMode = false;
let bgColor = [0, 0, 80];
let currentPalette = startingHues;
let ballSize = 50;

document.getElementById("toggle-dark").addEventListener("click", () => {
  darkMode = !darkMode;
  if (darkMode) {
    bgColor = [0, 0, 10];
    document.getElementById("toggle-dark").innerText = "Light Mode";
    document.getElementById("p5-canvas").style.border = "4px dashed #f8a7a7";
    document.getElementById("top").style.color = "rgb(206, 206, 206)";
  } else {
    bgColor = [0, 0, 80];
    document.getElementById("toggle-dark").innerText = "Dark Mode";
    document.getElementById("p5-canvas").style.border = "4px dashed #251313";
    document.getElementById("top").style.color = "rgb(44, 44, 44)";
  }
  document.body.style.backgroundColor = `hsl(${bgColor[0]}, ${bgColor[1]}%, ${bgColor[2]}%)`;
});

function createPalette() {
  const paletteContainer = document.getElementById("palette");
  paletteContainer.innerHTML = ""; // Clear existing palette
  currentPalette.forEach((color) => {
    const colorBox = document.createElement("div");
    colorBox.className = "color-box";
    colorBox.style.backgroundColor = `hsla(${color[0]}, ${color[1]}%, ${color[2]}%, ${color[3]})`;
    paletteContainer.appendChild(colorBox);
  });
}

document
  .getElementById("palette-selector")
  .addEventListener("change", (event) => {
    const selectedPalette = event.target.value;
    if (selectedPalette === "startingHues") {
      currentPalette = startingHues;
    } else if (selectedPalette === "brightCols") {
      currentPalette = brightCols;
    } else if (selectedPalette === "anotherPalette") {
      currentPalette = anotherPalette;
    } else if (selectedPalette === "yellowBlast") {
      currentPalette = yellowBlast;
    }
    createPalette();
  });

document
  .getElementById("ball-size-slider")
  .addEventListener("input", (event) => {
    ballSize = event.target.value;
    console.log(`Ball size: ${ballSize}`);
  });

class Ball {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = ballSize;
    this.colString = random(currentPalette);
    this.col = color(...this.colString);
    this.fading = 1;
    this.faded = false;
    this.alpha = alpha(this.col);
    this.fadeDuration = random(3 + Math.ceil(((255 - this.alpha) / 255) * 20)); // fadeDuration in seconds
    this.lightRate = 100 / FPS;
    this.nextPopupSeconds = Math.ceil(random(8));
    console.log(this.alpha);
  }

  draw() {
    push();
    translate(this.x, this.y);
    fill(this.col);
    if (this.fading == 1)
      if (this.alpha < 255) {
        this.alpha = this.alpha + 255 / ((this.fadeDuration * FPS) / 2);
        this.col.setAlpha(Math.floor(this.alpha));
      } else {
        this.fading = -1;
      }
    else
      this.col.setAlpha(
        this.alpha > 0
          ? Math.floor(
              (this.alpha = this.alpha - 255 / ((this.fadeDuration * FPS) / 2))
            )
          : 0
      );
    if (this.alpha == 0) this.faded = true;
    // this.col.setBlue(lightness(this.col) + this.brightRate)
    // this.colString[2] += this.lightRate
    // this.col = color(this.colString)
    circle(0, 0, this.r);
    pop();
  }
}

let balls = [];
function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent("p5-canvas");
  colorMode(HSL, 360, 100, 100, 255);
  for (let i = 0; i < 7; i++) {
    balls.push(new Ball(random(width), random(height)));
    console.log(balls[i].col.levels);
  }
  noStroke();
  createPalette();
}

function draw() {
  background(...bgColor);
  for (let i = 0; i < balls.length; i++) {
    if (balls[i].faded) balls.splice(i, 1);
    balls[i].draw();
    console.log(lightness(balls[i].col));
  }
  if (frameCount % (ballPopupDifference * FPS) == 0) {
    for (let i = 0; i < 5; i++)
      balls.push(new Ball(random(width), random(height)));
  }
  for (let j = 0; j < 4; j++) {
    if (
      frameCount %
        Math.floor(
          (ballPopupDifference + balls[balls.length - 1].nextPopupSeconds) * FPS
        ) ==
      0
    ) {
      for (let i = 0; i < 3; i++)
        balls.push(new Ball(random(width), random(height)));
    }
  }
  frameRate(FPS);
  console.log(balls);
}
