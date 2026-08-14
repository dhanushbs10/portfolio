import { writeFileSync } from "fs";
import { deflateSync } from "zlib";

const W = 1200, H = 630;

function crc32(buf) {
  let crc = ~0;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return (~crc >>> 0);
}

function chunk(type, data) {
  const typeBytes = Buffer.from(type);
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crcData = Buffer.concat([typeBytes, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(crcData), 0);
  return Buffer.concat([len, typeBytes, data, crc]);
}

const rowStride = 1 + W * 4; // filter byte + RGBA
const raw = Buffer.alloc(H * rowStride);

// Dark fill #0a0b0f
for (let y = 0; y < H; y++) {
  const rowStart = y * rowStride;
  raw[rowStart] = 0;
  for (let x = 0; x < W; x++) {
    const i = rowStart + 1 + x * 4;
    raw[i] = 10; raw[i+1] = 11; raw[i+2] = 15; raw[i+3] = 255;
  }
}

// Cyan accent line at center
const cy = Math.floor(H / 2);
for (let x = Math.floor(W * 0.05); x < Math.floor(W * 0.95); x++) {
  for (let dy = -3; dy <= 3; dy++) {
    const yy = cy + dy;
    if (yy < 0 || yy >= H) continue;
    const i = yy * rowStride + 1 + x * 4;
    raw[i] = 6; raw[i+1] = 182; raw[i+2] = 212; raw[i+3] = 255;
  }
}

const signature = Buffer.from("PNG\r\n\x1a\n");
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

const png = Buffer.concat([
  signature,
  chunk("IHDR", ihdr),
  chunk("IDAT", deflateSync(raw)),
  chunk("IEND", Buffer.alloc(0)),
]);

writeFileSync("public/og-image.png", png);
console.log("Generated public/og-image.png (1200x630)");
