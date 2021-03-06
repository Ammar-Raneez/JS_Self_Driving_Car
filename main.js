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
let bestCar = cars[0];

if (localStorage.getItem('bestBrain')) {
  cars.forEach((car, i) => {
    car.brain = JSON.parse(
      localStorage.getItem('bestBrain')
    );

    if (i != 0) {
      NeuralNetwork.mutate(car.brain, 0.2);
    }
  });
}

const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, 'DUMMY', 2),
  new Car(road.getLaneCenter(0), -300, 30, 50, 'DUMMY', 2),
  new Car(road.getLaneCenter(2), -300, 30, 50, 'DUMMY', 2),
  new Car(road.getLaneCenter(0), -500, 30, 50, 'DUMMY', 2),
  new Car(road.getLaneCenter(1), -500, 30, 50, 'DUMMY', 2),
  new Car(road.getLaneCenter(1), -700, 30, 50, 'DUMMY', 2),
  new Car(road.getLaneCenter(2), -700, 30, 50, 'DUMMY', 2),
];

animate();

function saveBestCar() {
  localStorage.setItem('bestBrain', JSON.stringify(bestCar.brain));
}

function discardBestCar() {
  localStorage.removeItem('bestBrain');
}

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

  // Find best car - the one that has the min y value
  bestCar = cars.find(
    c => c.y == Math.min(
      ...cars.map(c => c.y)
    )
  );

  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

  road.draw(carCtx);

  for (let t of traffic) {
    t.draw(carCtx, 'red');
  }

  carCtx.globalAlpha = 0.2;
  for (let car of cars) {
    car.draw(carCtx, 'blue');
  }
  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, 'blue', true);

  carCtx.restore();

  networkCtx.lineDashOffset = -time / 50;
  Visualizer.drawNetwork(networkCtx, bestCar.brain);

  // Calls animate again and again many times per second
  requestAnimationFrame(animate);
}