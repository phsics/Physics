let canvas = document.getElementById("myCanvas");
let c = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const Mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2,
};

const Centre = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
};

addEventListener("mousemove", (e) => {
  Mouse.x = e.x;
  Mouse.y = e.y;
});

const randomNumInRange = (a, b) => {
  return Math.floor(Math.random() * (b - a + 1) + a);
};

const randColor = () => {
  let hexDigits = "0123456789abcdef";
  let colorCode = "#";
  for (let i = 0; i < 6; i++) {
    let indx = randomNumInRange(0, 15);
    colorCode = colorCode + hexDigits[indx];
  }
  return colorCode;
};

const theme = () => {
  let colorArray = [
    "#C179B9",
    "#A42CD6",
    "#A42CD6",
    "#502274",
  ];
  return colorArray[randomNumInRange(0, colorArray.length - 1)];
};

const distance = (x1, y1, x2, y2, color) => {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};

const detectRectCollision = (rect1, rect2) => {
  return (
    rect2.x + rect2.width >= rect1.x &&
    rect2.x <= rect1.x + rect1.width &&
    rect2.y + rect2.height >= rect1.y &&
    rect2.y <= rect1.y + rect1.height
  );
};

class Particle {
  constructor(radius, color) {
    this.radius = radius;
    this.color = color;
    this.velocity = 0.03 + 0.02 * Math.random();
    this.distanceFromCentre = randomNumInRange(50, 100);
    this.radian = Math.random() * Math.PI * 2;
    this.x = Mouse.x + this.distanceFromCentre * Math.sin(this.radian);
    this.y = Mouse.y + this.distanceFromCentre * Math.cos(this.radian);
    this.lastMouse = {
      x: Mouse.x,
      y: Mouse.y,
    };
  }
  update() {
    const lastPoint = {
      x: this.x,
      y: this.y,
    };
    this.lastMouse.x += (Mouse.x - this.lastMouse.x) * 0.03;
    this.lastMouse.y += (Mouse.y - this.lastMouse.y) * 0.03;
    this.x = this.lastMouse.x + this.distanceFromCentre * Math.sin(this.radian);
    this.y = this.lastMouse.y + this.distanceFromCentre * Math.cos(this.radian);
    this.radian += this.velocity;
    this.draw(lastPoint);
  }
  draw(lastPoint) {
    c.beginPath();
    c.strokeStyle = this.color;
    c.lineWidth = this.radius;
    c.lineCap = "round";
    c.moveTo(lastPoint.x, lastPoint.y);
    c.lineTo(this.x, this.y);
    c.stroke();
    c.closePath();
  }
}

let particles = [];
const init = () => {
  for (let i = 0; i < 100; i++) {
    let radius = Math.random() * 5+5;
    let color = randColor();
    particles.push(new Particle(radius, color));
  }
};

function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = "rgba(255,255,255,.1)";
  c.fillRect(0, 0, window.innerWidth, window.innerHeight);
  particles.forEach((particle) => {
    particle.update();
  });
}
init();
animate();
