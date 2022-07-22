// Define cavas
const carCanvas = document.getElementById('car-canvas');
const networkCanvas = document.getElementById('network-canvas');
carCanvas.width = 200;
networkCanvas.width = 300;

// Ref to canvas context
const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);

const N = 100;
const cars = generateAICars(N);

const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, 'DUMMY', 2),
];

animate();

function generateAICars(N) {
  const genCars = [];
  for (let i = 1; i <= N; i++) {
    genCars.push(new Car(road.getLaneCenter(1), 100, 30, 50, 'AI'));
  }
  return genCars;
}

function animate(time) {
  for (let t of traffic) {
    t.update(road.borders, []);
  }

  for (let car of cars) {
    car.update(road.borders, traffic);
  }

  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -cars[0].y + carCanvas.height * 0.7);

  road.draw(carCtx);

  for (let t of traffic) {
    t.draw(carCtx, 'red');
  }

  carCtx.globalAlpha = 0.2;
  for (let car of cars) {
    car.draw(carCtx, 'blue');
  }
  carCtx.globalAlpha = 1;
  cars[0].draw(carCtx, 'blue', true);

  carCtx.restore();

  networkCtx.lineDashOffset = -time / 50;
  Visualizer.drawNetwork(networkCtx, cars[0].brain);

  // Calls animate again and again many times per second
  requestAnimationFrame(animate);
}