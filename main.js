const canvas = document.getElementById('car-canvas');
canvas.width = 200;

// Ref to canvas context
const ctx = canvas.getContext('2d');

const car = new Car(100, 100, 30, 30);
car.draw(ctx);

animate();

function animate() {
  car.update();
  canvas.height = window.innerHeight;
  car.draw(ctx);

  // Calls animate again and again many times per second
  requestAnimationFrame(animate);
}