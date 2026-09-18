const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// CRC32 table
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) {
      c = 0xedb88320 ^ (c >>> 1);
    } else {
      c = c >>> 1;
    }
  }
  crcTable[n] = c >>> 0;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);

  const toCrc = Buffer.concat([typeBuf, data]);
  const crcVal = crc32(toCrc);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crcVal, 0);

  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function generateJarvisPng(size, isMaskable = false) {
  // Raw scanline buffer: each row has 1 filter byte (0) + size * 4 RGBA bytes
  const rowLen = 1 + size * 4;
  const rawData = Buffer.alloc(rowLen * size);

  const cx = size / 2;
  const cy = size / 2;
  const rOuter = size * 0.45;
  const rCore = size * (isMaskable ? 0.22 : 0.28);
  const rGlow = size * (isMaskable ? 0.35 : 0.40);

  for (let y = 0; y < size; y++) {
    const rowOffset = y * rowLen;
    rawData[rowOffset] = 0; // Filter: None

    for (let x = 0; x < size; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Background: Deep futuristic dark slate/black
      let r = 2;
      let g = 6;
      let b = 23;
      let a = 255;

      if (dist <= rOuter) {
        // Subtle tech ring
        const ring1 = Math.abs(dist - rOuter * 0.85);
        const ring2 = Math.abs(dist - rOuter * 0.65);

        if (ring1 < (size > 200 ? 3 : 2)) {
          r = 6; g = 182; b = 212; // cyan-500
        } else if (ring2 < (size > 200 ? 2 : 1)) {
          r = 56; g = 189; b = 248; // sky-400
        }

        // Glowing core
        if (dist <= rGlow) {
          const glowFactor = 1 - dist / rGlow;
          r = Math.min(255, r + Math.floor(6 * glowFactor * 20));
          g = Math.min(255, g + Math.floor(182 * glowFactor));
          b = Math.min(255, b + Math.floor(212 * glowFactor));
        }

        if (dist <= rCore) {
          const coreFactor = 1 - dist / rCore;
          // bright cyan to white center
          r = Math.min(255, Math.floor(165 * (1 - coreFactor) + 255 * coreFactor));
          g = Math.min(255, Math.floor(243 * (1 - coreFactor) + 255 * coreFactor));
          b = Math.min(255, Math.floor(252 * (1 - coreFactor) + 255 * coreFactor));
        }

        // Inner white point
        if (dist <= rCore * 0.3) {
          r = 255; g = 255; b = 255;
        }
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  // PNG Signature
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // 8 bit
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0; // Deflate
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Non-interlaced

  const ihdrChunk = makeChunk('IHDR', ihdr);

  // IDAT
  const compressed = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressed);

  // IEND
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. 192x192
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), generateJarvisPng(192, false));
console.log('Created pwa-192x192.png');

// 2. 512x512
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), generateJarvisPng(512, false));
console.log('Created pwa-512x512.png');

// 3. Maskable 512x512
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), generateJarvisPng(512, true));
console.log('Created pwa-maskable-512x512.png');

// 4. Apple Touch Icon 180x180
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), generateJarvisPng(180, false));
console.log('Created apple-touch-icon.png');

// 5. Favicon copy
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), generateJarvisPng(64, false));
console.log('Created favicon.ico');

console.log('All PWA and desktop icons successfully generated!');
