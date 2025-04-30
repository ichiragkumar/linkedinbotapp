const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');


// Sizes needed for Chrome extension
const sizes = [16, 48, 128];

// Create directory if it doesn't exist
if (!fs.existsSync(path.join(__dirname))) {
  fs.mkdirSync(path.join(__dirname), { recursive: true });
}

// Generate icons for each size
sizes.forEach(size => {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Draw background
  ctx.fillStyle = '#0a66c2'; // LinkedIn blue
  ctx.fillRect(0, 0, size, size);
  
  // Draw bookmark icon
  ctx.fillStyle = 'white';
  const margin = size * 0.2;
  const width = size - (margin * 2);
  const height = size - (margin * 2);
  
  // Draw a simple bookmark shape
  ctx.beginPath();
  ctx.moveTo(margin, margin);
  ctx.lineTo(margin + width, margin);
  ctx.lineTo(margin + width, margin + height);
  ctx.lineTo(margin + (width / 2), margin + (height * 0.75));
  ctx.lineTo(margin, margin + height);
  ctx.closePath();
  ctx.fill();
  
  // Save the icon
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(__dirname, `icon${size}.png`), buffer);
  
  console.log(`Generated icon${size}.png`);
});