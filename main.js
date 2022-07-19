const canvas = document.getElementById('car-canvas');
canvas.width = 200;

// Ref to canvas context
const ctx = canvas.getContext('2d');
const road = new Road(canvas.width / 2, canvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 30);
car.draw(ctx);

animate();

function animate() {
  car.update();
  canvas.height = window.innerHeight;
  road.draw(ctx);
  car.draw(ctx);

  // Calls animate again and again many times per second
  requestAnimationFrame(animate);
}