const carCanvas = document.getElementById('car-canvas');
const networkCanvas = document.getElementById('network-canvas');
carCanvas.width = 200;
networkCanvas.width = 300;

// Ref to carCanvas context
const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 30, 'AI');
const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, 'DUMMY', 2),
];

animate();

function animate(time) {
  for (let t of traffic) {
    t.update(road.borders, []);
  }

  car.update(road.borders, traffic);
  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -car.y + carCanvas.height * 0.7);
  road.draw(carCtx);

  for (let t of traffic) {
    t.draw(carCtx, 'red');
  }

  car.draw(carCtx, 'blue');
  carCtx.restore();

  networkCtx.lineDashOffset = -time / 50;
  Visualizer.drawNetwork(networkCtx, car.brain);

  // Calls animate again and again many times per second
  requestAnimationFrame(animate);
}