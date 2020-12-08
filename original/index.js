import { Spotlight } from "./spotlight.js";
import { Point } from "./point.js";
import { Rectangle } from "./rectangle.js";

const context = document.querySelector('#final').getContext('2d');

const rectangles = [
  new Rectangle(100, 100, 20, 20),
  new Rectangle(160, 200, 30, 60),
  new Rectangle(300, 70, 80, 20)
];

const spotlights = [
  new Spotlight(new Point(200, 10), 100, 800, '#f00', context),
  new Spotlight(new Point(10, 200), 0, 800, '#0f0', context),
  new Spotlight(new Point(380, 380), 0, 800, '#00f', context)
];

spotlights.forEach(spotlight => spotlight.calculateShadows(rectangles))

const mousePosition = new Point(0, 0);

window.onload = () => {
  window.requestAnimationFrame(draw);
};

async function draw() {
  context.clearRect(0, 0, 500, 500);
  context.fillStyle = '#444';
  context.fillRect(0, 0, 500, 500);


  spotlights.forEach(async spotlight => {
    context.globalCompositeOperation = 'source-over';
    spotlight.pointAt(mousePosition);
    spotlight.draw();

    context.globalCompositeOperation = 'screen';
    context.drawImage(await spotlight.getBitmap(), 0, 0);
  });
  
  context.fillStyle = '#fff';
  rectangles.forEach(rectangle => {
    context.fillRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
  });

  window.requestAnimationFrame(draw);
}

document.querySelector('#final').addEventListener('mousemove', (event) => {
  mousePosition.x = event.offsetX;
  mousePosition.y = event.offsetY;
});

document.querySelector('#final').addEventListener('touchmove', (event) => {
  mousePosition.x = event.offsetX;
  mousePosition.y = event.offsetY;
});
