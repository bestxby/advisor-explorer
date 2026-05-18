/* global process */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import jpeg from 'jpeg-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const inputPath = path.join(projectRoot, 'public', 'shape4.jpg');
const outputPath = path.join(projectRoot, 'public', 'shape4_points.json');

console.log('Reading shape4.jpg from:', inputPath);

try {
  const jpegBuffer = fs.readFileSync(inputPath);
  const rawImageData = jpeg.decode(jpegBuffer, { useTps: true });

  const W = rawImageData.width;
  const H = rawImageData.height;
  console.log(`Successfully decoded JPEG: ${W}x${H}`);

  const maxDim = 120;
  const aspect = W / H;
  const canvasW = aspect >= 1 ? maxDim : Math.round(maxDim * aspect);
  const canvasH = aspect >= 1 ? Math.round(maxDim / aspect) : maxDim;
  console.log(`Downsampling image to: ${canvasW}x${canvasH}`);

  const threshold = 35; // Matches runtime threshold for shape4
  const zDepth = 5;     // Matches shape4 zDepth
  const worldSize = 38;
  const scaleX = aspect >= 1 ? worldSize : worldSize * aspect;
  const scaleY = aspect >= 1 ? worldSize / aspect : worldSize;

  const points = [];

  for (let y = 0; y < canvasH; y++) {
    for (let x = 0; x < canvasW; x++) {
      // Map canvas coordinates back to original image
      const sx = Math.min(W - 1, Math.floor((x / canvasW) * W));
      const sy = Math.min(H - 1, Math.floor((y / canvasH) * H));

      const idx = (sy * W + sx) * 4;
      const r = rawImageData.data[idx];
      const g = rawImageData.data[idx + 1];
      const b = rawImageData.data[idx + 2];

      const brightness = (r + g + b) / 3;
      if (brightness > threshold) {
        const posX = (x / canvasW - 0.5) * scaleX;
        const posY = (0.5 - y / canvasH) * scaleY;
        const posZ = (brightness / 765 - 0.5) * zDepth;

        // Truncate floating point representation to save space while maintaining full fidelity
        points.push({
          pos: [
            parseFloat(posX.toFixed(3)),
            parseFloat(posY.toFixed(3)),
            parseFloat(posZ.toFixed(3))
          ],
          col: [
            parseFloat((r / 255).toFixed(3)),
            parseFloat((g / 255).toFixed(3)),
            parseFloat((b / 255).toFixed(3))
          ]
        });
      }
    }
  }

  console.log(`Generated ${points.length} points!`);

  // Save to public assets
  fs.writeFileSync(outputPath, JSON.stringify(points));
  console.log('Successfully saved pre-calculated points to:', outputPath);
  console.log(`File size: ${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB`);

} catch (err) {
  console.error('Error pre-calculating points:', err);
  process.exit(1);
}
