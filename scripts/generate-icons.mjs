import { deflateSync } from "node:zlib";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const BASE_SIZE = 32;
const ICON_DIR = path.join("assets", "icons");
const APP_ICON_SIZES = [16, 32, 48, 64, 128, 256, 512, 1024];
const ICNS_ENTRIES = [
  ["icp4", 16],
  ["icp5", 32],
  ["icp6", 64],
  ["ic07", 128],
  ["ic08", 256],
  ["ic09", 512],
  ["ic10", 1024]
];

await mkdir("assets", { recursive: true });
await mkdir(ICON_DIR, { recursive: true });

const trayIdle = renderIcon(false);
const trayLit = renderIcon(true);
const appIcon = renderIcon(true);

await writeFile(path.join("assets", "tray-icon.png"), encodePng(trayIdle.width, trayIdle.height, trayIdle.pixels));
await writeFile(path.join("assets", "tray-icon-lit.png"), encodePng(trayLit.width, trayLit.height, trayLit.pixels));

const appIconPngs = new Map();
for (const size of APP_ICON_SIZES) {
  const png = encodeScaledPng(appIcon, size);
  appIconPngs.set(size, png);
  await writeFile(path.join(ICON_DIR, `app-icon-${size}.png`), png);
}

await writeFile(path.join(ICON_DIR, "app-icon.png"), appIconPngs.get(1024));
await writeFile(path.join(ICON_DIR, "app-icon.ico"), encodeIco([16, 32, 48, 64, 128, 256], appIconPngs));
await writeFile(path.join(ICON_DIR, "app-icon.icns"), encodeIcns(ICNS_ENTRIES, appIconPngs));

function renderIcon(lit) {
  const width = BASE_SIZE;
  const height = BASE_SIZE;
  const pixels = new Uint8Array(width * height * 4);

  drawRect(pixels, width, 9, 22, 23, 26, [123, 76, 38, 255]);
  drawRect(pixels, width, 7, 24, 25, 27, [218, 151, 67, 255]);
  drawRect(pixels, width, 10, 26, 22, 28, [76, 55, 43, 255]);
  drawRect(pixels, width, 11, 20, 21, 22, [245, 189, 98, 255]);

  for (const x of [12, 16, 20]) {
    drawLine(pixels, width, x, 9, x, 22, [183, 116, 67, 255]);
    drawLine(pixels, width, x + 1, 9, x + 1, 22, [92, 57, 39, 255]);
    if (lit) {
      drawDisc(pixels, width, x, 8, 2, [249, 190, 87, 255]);
      drawDisc(pixels, width, x, 7, 1, [255, 244, 176, 255]);
    } else {
      drawDisc(pixels, width, x, 8, 1, [164, 123, 87, 255]);
    }
  }

  if (lit) {
    drawSmoke(pixels, width, 11, [146, 229, 207, 180]);
    drawSmoke(pixels, width, 16, [255, 232, 182, 150]);
    drawSmoke(pixels, width, 21, [146, 229, 207, 150]);
  }

  return { width, height, pixels };
}

function encodeScaledPng(icon, size) {
  if (size === icon.width && size === icon.height) {
    return encodePng(icon.width, icon.height, icon.pixels);
  }
  return encodePng(size, size, scalePixels(icon.pixels, icon.width, icon.height, size, size));
}

function scalePixels(source, sourceWidth, sourceHeight, targetWidth, targetHeight) {
  const target = new Uint8Array(targetWidth * targetHeight * 4);

  for (let y = 0; y < targetHeight; y += 1) {
    const sourceY = Math.min(sourceHeight - 1, Math.floor((y / targetHeight) * sourceHeight));
    for (let x = 0; x < targetWidth; x += 1) {
      const sourceX = Math.min(sourceWidth - 1, Math.floor((x / targetWidth) * sourceWidth));
      const sourceOffset = (sourceY * sourceWidth + sourceX) * 4;
      const targetOffset = (y * targetWidth + x) * 4;
      target[targetOffset] = source[sourceOffset];
      target[targetOffset + 1] = source[sourceOffset + 1];
      target[targetOffset + 2] = source[sourceOffset + 2];
      target[targetOffset + 3] = source[sourceOffset + 3];
    }
  }

  return target;
}

function encodePng(width, height, pixels) {
  const raw = Buffer.alloc(height * (width * 4 + 1));
  for (let y = 0; y < height; y += 1) {
    const rowStart = y * (width * 4 + 1);
    raw[rowStart] = 0;
    for (let x = 0; x < width * 4; x += 1) {
      raw[rowStart + 1 + x] = pixels[y * width * 4 + x];
    }
  }

  return Buffer.concat([
    PNG_SIGNATURE,
    pngChunk("IHDR", Buffer.concat([uint32(width), uint32(height), Buffer.from([8, 6, 0, 0, 0])])),
    pngChunk("IDAT", deflateSync(raw)),
    pngChunk("IEND", Buffer.alloc(0))
  ]);
}

function encodeIco(sizes, pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(sizes.length, 4);

  const directory = Buffer.alloc(16 * sizes.length);
  let imageOffset = header.length + directory.length;
  const images = [];

  sizes.forEach((size, index) => {
    const image = pngs.get(size);
    if (!image) {
      throw new Error(`Missing ${size}px PNG for ICO generation`);
    }

    const entryOffset = index * 16;
    directory[entryOffset] = size >= 256 ? 0 : size;
    directory[entryOffset + 1] = size >= 256 ? 0 : size;
    directory[entryOffset + 2] = 0;
    directory[entryOffset + 3] = 0;
    directory.writeUInt16LE(1, entryOffset + 4);
    directory.writeUInt16LE(32, entryOffset + 6);
    directory.writeUInt32LE(image.length, entryOffset + 8);
    directory.writeUInt32LE(imageOffset, entryOffset + 12);
    images.push(image);
    imageOffset += image.length;
  });

  return Buffer.concat([header, directory, ...images]);
}

function encodeIcns(entries, pngs) {
  const chunks = entries.map(([type, size]) => {
    const image = pngs.get(size);
    if (!image) {
      throw new Error(`Missing ${size}px PNG for ICNS generation`);
    }

    const header = Buffer.alloc(8);
    header.write(type, 0, 4, "ascii");
    header.writeUInt32BE(image.length + 8, 4);
    return Buffer.concat([header, image]);
  });

  const totalLength = 8 + chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const header = Buffer.alloc(8);
  header.write("icns", 0, 4, "ascii");
  header.writeUInt32BE(totalLength, 4);
  return Buffer.concat([header, ...chunks]);
}

function pngChunk(type, data) {
  const typeBuffer = Buffer.from(type, "ascii");
  return Buffer.concat([uint32(data.length), typeBuffer, data, uint32(crc32(Buffer.concat([typeBuffer, data])))]);
}

function uint32(value) {
  const buffer = Buffer.alloc(4);
  buffer.writeUInt32BE(value >>> 0);
  return buffer;
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let i = 0; i < 8; i += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function drawRect(pixels, width, x1, y1, x2, y2, color) {
  for (let y = y1; y <= y2; y += 1) {
    for (let x = x1; x <= x2; x += 1) {
      setPixel(pixels, width, x, y, color);
    }
  }
}

function drawDisc(pixels, width, centerX, centerY, radius, color) {
  for (let y = centerY - radius; y <= centerY + radius; y += 1) {
    for (let x = centerX - radius; x <= centerX + radius; x += 1) {
      if ((x - centerX) ** 2 + (y - centerY) ** 2 <= radius ** 2) {
        setPixel(pixels, width, x, y, color);
      }
    }
  }
}

function drawSmoke(pixels, width, startX, color) {
  for (let i = 0; i < 8; i += 1) {
    const x = startX + Math.round(Math.sin(i * 1.4) * 2);
    const y = 3 + i;
    setPixel(pixels, width, x, y, color);
  }
}

function drawLine(pixels, width, x1, y1, x2, y2, color) {
  const dx = Math.abs(x2 - x1);
  const dy = -Math.abs(y2 - y1);
  const stepX = x1 < x2 ? 1 : -1;
  const stepY = y1 < y2 ? 1 : -1;
  let error = dx + dy;
  let x = x1;
  let y = y1;

  while (true) {
    setPixel(pixels, width, x, y, color);
    if (x === x2 && y === y2) break;
    const error2 = 2 * error;
    if (error2 >= dy) {
      error += dy;
      x += stepX;
    }
    if (error2 <= dx) {
      error += dx;
      y += stepY;
    }
  }
}

function setPixel(pixels, width, x, y, [r, g, b, a]) {
  const height = pixels.length / 4 / width;
  if (x < 0 || y < 0 || x >= width || y >= height) return;
  const offset = (y * width + x) * 4;
  pixels[offset] = r;
  pixels[offset + 1] = g;
  pixels[offset + 2] = b;
  pixels[offset + 3] = a;
}
