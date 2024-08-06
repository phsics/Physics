let canvas = document.querySelector("canvas");
let c = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gravity = 0.02;
const friction = 0.9999;

const mouse = {
  x: undefined,
  y: undefined,
};

addEventListener("mousemove", (evt) => {
  mouse.x = evt.x;
  mouse.y = evt.y;
});

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  particles = [];
  init();
});


const randColor = () => {
  let hex = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "8",
    "9",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
  ];
  let rand = [];
  for (let i = 0; i < 6; i++) {
    indx = Math.floor(Math.random() * 16);
    rand.push(hex[indx]);
  }
  let colorCode =
    "#" + rand[0] + rand[1] + rand[2] + rand[3] + rand[4] + rand[5];

  //   let colorArray = ["#2660A4", "#EDF7F6", "#F19953", "#C47335", "#56351E"];

  //   return colorArray[Math.floor(Math.random() * colorArray.length)];

  return colorCode;
};

const getDistance = (x1, y1, x2, y2) => {
  let x = Math.abs(x1 - x2);
  let y = Math.abs(y1 - y2);
  return Math.sqrt(x * x + y * y);
};

function resolveCollision(particle1, particle2) {
  const u1 = {
    x: particle1.velocity.x,
    y: particle1.velocity.y,
  };
  const u2 = {
    x: particle2.velocity.x,
    y: particle2.velocity.y,
  };
  const v1 = {
    x: undefined,
    y: undefined,
  };
  const v2 = {
    x: undefined,
    y: undefined,
  };
  m1 = particle1.mass;
  m2 = particle2.mass;
  const xVelocityDiff = u1.x - u2.x;
  const yVelocityDiff = u1.y - u2.y;
  const xDist = particle2.x - particle1.x;
  const yDist = particle2.y - particle1.y;

  if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
    v1.x = ((m1 - m2) * u1.x + 2 * m2 * u2.x) / (m1 + m2);
    v1.y = ((m1 - m2) * u1.y + 2 * m2 * u2.y) / (m1 + m2);
    v2.x = ((m2 - m1) * u2.x + 2 * m1 * u1.x) / (m1 + m2);
    v2.y = ((m2 - m1) * u2.y + 2 * m1 * u1.y) / (m1 + m2);

    particle1.velocity = {
      x: v1.x,
      y: v1.y,
    };
    particle2.velocity = {
      x: v2.x,
      y: v2.y,
    };
  }
}

class Particle {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    (this.velocity = {
      x: (Math.random() - 0.5) * 5,
      y: (Math.random() - 0.5) * 5,
    }),
      (this.radius = radius);
    this.color = color;
    this.mass = this.radius / 20;
    this.opacity = 0.1;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, 0);
    c.strokeStyle = this.color;
    c.stroke();
    c.fillStyle = this.color;
    c.save();
    c.globalAlpha = this.opacity;
    c.fill();
    c.restore();
    c.closePath();
  }

  update(particles) {
    this.draw();
    for (let i = 0; i < particles.length; i++) {
      if (this === particles[i]) {
        continue;
      }
      if (getDistance(this.x, this.y, particles[i].x, particles[i].y) -this.radius-particles[i].radius <=0){

        resolveCollision(this, particles[i]);
      }
    }
    if (this.x + this.radius > window.innerWidth || this.x - this.radius <= 1) {
      this.velocity.x = -this.velocity.x;
    }
    if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
      this.velocity.y = -this.velocity.y;
    }
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

let particles = [];

function init() {
  for (let i = 0; i < 300; i++) {
    let radius = 10 * Math.random();;
    let x = Math.random() * (window.innerWidth - 2 * radius) + radius;
    let y = Math.random() * (window.innerHeight - 2 * radius) + radius;
    let color = randColor();

    if (i != 0) {
      for (let j = 0; j < particles.length; j++) {
        if (getDistance(x, y, particles[j].x, particles[j].y) - 2 * radius <0) {
          x = Math.random() * (window.innerWidth - 2 * radius) + radius;
          y = Math.random() * (window.innerHeight - 2 * radius) + radius;
          j = -1;
        }
      }
    }
    particles.push(new Particle(x, y, radius, color));
  }
}

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, innerWidth, innerHeight);
  
  for (let i = 0; i < particles.length; i++) {
    particles[i].update(particles);
  }
}
init();
animate();
