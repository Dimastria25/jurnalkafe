import sharp from "sharp";
import { mkdirSync } from "fs";

mkdirSync("public/icons", { recursive: true });

const svg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="112" fill="#6b4226"/>
  <circle cx="256" cy="256" r="210" fill="#3c2415"/>
  <path d="M150 220h180a10 10 0 0 1 10 10v70c0 60-45 100-100 100s-100-40-100-100v-70a10 10 0 0 1 10-10z" fill="#faf3e7"/>
  <path d="M330 235h20c28 0 50 22 50 50s-22 50-50 50h-14" stroke="#faf3e7" stroke-width="18" fill="none" stroke-linecap="round"/>
  <path d="M185 160c-10 15 10 20 0 35" stroke="#d9a441" stroke-width="14" fill="none" stroke-linecap="round"/>
  <path d="M225 150c-10 15 10 20 0 35" stroke="#d9a441" stroke-width="14" fill="none" stroke-linecap="round"/>
  <path d="M265 160c-10 15 10 20 0 35" stroke="#d9a441" stroke-width="14" fill="none" stroke-linecap="round"/>
</svg>`;

const sizes = [192, 512];
for (const size of sizes) {
  await sharp(Buffer.from(svg))
    .resize(size, size)
    .png()
    .toFile(`public/icons/icon-${size}.png`);
}

await sharp(Buffer.from(svg)).resize(180, 180).png().toFile("public/icons/apple-touch-icon.png");

console.log("Icons generated");
