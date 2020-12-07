import { Spotlight } from "./spotlight.js";
import { Point } from "./point.js";
import { Rectangle } from "./rectangle.js";

const redContext = document.querySelector('#red').getContext('2d');
const greenContext = document.querySelector('#green').getContext('2d');
const blueContext = document.querySelector('#blue').getContext('2d');
const finalContext = document.querySelector('#final').getContext('2d');

const rectangle = new Rectangle(100, 100, 20, 20);
const rectangle1 = new Rectangle(160, 200, 30, 60);
const rectangle2 = new Rectangle(300, 70, 80, 20);

const spotlight = new Spotlight(new Point(200, 10), 100, 800, '#f00', redContext);
const spotlight2 = new Spotlight(new Point(10, 200), 0, 800, '#0f0', greenContext);
const spotlight3 = new Spotlight(new Point(380, 380), 0, 800, '#00f', blueContext);

spotlight.calculateShadows([rectangle, rectangle1, rectangle2]);
spotlight2.calculateShadows([rectangle, rectangle1, rectangle2]);
spotlight3.calculateShadows([rectangle, rectangle1, rectangle2]);

const mousePosition = new Point(0, 0);

window.onload = () => {
  window.requestAnimationFrame(draw);
};

async function draw() {
  finalContext.clearRect(0, 0, 500, 500);
  finalContext.fillStyle = '#444';
  finalContext.fillRect(0, 0, 500, 500);

  spotlight.pointAt(mousePosition);
  spotlight.draw();

  spotlight2.pointAt(mousePosition);
  spotlight2.draw();

  spotlight3.pointAt(mousePosition);
  spotlight3.draw();

  const redLightmap = redContext.getImageData(0, 0, 500, 500);
  const greenLightmap = greenContext.getImageData(0, 0, 500, 500);
  const blueLightmap = blueContext.getImageData(0, 0, 500, 500);

  finalContext.globalCompositeOperation = 'screen';

  finalContext.drawImage(await createImageBitmap(redLightmap), 0, 0);
  finalContext.drawImage(await createImageBitmap(greenLightmap), 0, 0);
  finalContext.drawImage(await createImageBitmap(blueLightmap), 0, 0);

  finalContext.globalCompositeOperation = 'source-over';
  
  finalContext.fillStyle = '#fff';
  finalContext.fillRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
  finalContext.fillRect(rectangle1.x, rectangle1.y, rectangle1.width, rectangle1.height);
  finalContext.fillRect(rectangle2.x, rectangle2.y, rectangle2.width, rectangle2.height);

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
