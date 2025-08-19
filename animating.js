let time = 0;
let drawx = [];
let drawy = [];

// Fourier coefficients are loaded from coeff file
// let fourierCoefficients = [...]

let freqArray = [];
for (let i = 0; i < Math.round(fourierCoefficients.length / 2); i++) {
  if (i === 0) {
    freqArray.push(0);
  } else {
    freqArray.push(i);
    freqArray.push(-i);
  }
}

console.log(freqArray);
console.log(fourierCoefficients);

let scaleCoeff = 5;   // base multiplier
let offsetX = 0;      // centering offset
let offsetY = 0;
let zoom = 1;         // auto fit

function setup() {
  createCanvas(windowWidth, windowHeight);

  // --- Precompute bounding box to fit ---
  let testx = 0, testy = 0;
  let tmpX = [], tmpY = [];

  let t = 0;
  while (t < 1) {  // simulate one full cycle
    let x = 0, y = 0;
    for (let k = 0; k < fourierCoefficients.length; k++) {
      let frequency = freqArray[k];
      let coeff = math.complex(fourierCoefficients[k]);

      x += scaleCoeff *
        (math.re(coeff) * Math.cos(2 * Math.PI * frequency * t) +
         math.im(coeff) * Math.sin(2 * Math.PI * frequency * t));
      y += scaleCoeff *
        (-1 * math.im(coeff) * Math.cos(2 * Math.PI * frequency * t) +
          math.re(coeff) * Math.sin(2 * Math.PI * frequency * t));
    }
    tmpX.push(x);
    tmpY.push(y);
    t += 0.002;
  }

  let minX = Math.min(...tmpX);
  let maxX = Math.max(...tmpX);
  let minY = Math.min(...tmpY);
  let maxY = Math.max(...tmpY);

  let w = maxX - minX;
  let h = maxY - minY;

  // compute zoom to fit screen (with margin)
  zoom = 0.9 * Math.min(width / w, height / h);

  // centering offset
  offsetX = -(minX + maxX) / 2;
  offsetY = -(minY + maxY) / 2;
}

function draw() {
  background("#000000");
  translate(width / 2, height / 2); // center screen
  scale(zoom);

  let x = offsetX;
  let y = offsetY;
  let intiX, initY;

  for (let k = 0; k < fourierCoefficients.length; k++) {
    let frequency = freqArray[k];
    intiX = x;
    initY = y;

    let coeff = math.complex(fourierCoefficients[k]);
    let radius = scaleCoeff * math.abs(coeff);

    // Draw epicycle circle
    noFill();
    stroke("#FF6B6B");
    ellipse(intiX, initY, radius * 2, radius * 2);

    // Advance the tip
    x +=
      scaleCoeff *
      (math.re(coeff) * Math.cos(2 * Math.PI * frequency * time) +
        math.im(coeff) * Math.sin(2 * Math.PI * frequency * time));
    y +=
      scaleCoeff *
      (-1 * math.im(coeff) * Math.cos(2 * Math.PI * frequency * time) +
        math.re(coeff) * Math.sin(2 * Math.PI * frequency * time));

    // Draw the arm
    stroke("#D9ED92");
    line(intiX, initY, x, y);

    // Tip point
    fill("#184E77");
    stroke("#D9ED92");
    ellipse(x, y, 6);
  }

  // Path of tip
  drawx.unshift(x);
  drawy.unshift(y);

  beginShape();
  noFill();
  stroke("#FFFFFF");
  for (let i = 0; i < drawx.length; i++) {
    vertex(drawx[i], drawy[i]);
  }
  endShape();

  const point_limit = 500;
  if (drawx.length > point_limit) drawx.pop();
  if (drawy.length > point_limit) drawy.pop();

  time += 0.002;
}
