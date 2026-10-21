// Sinh ảnh minh họa SVG cho chế độ demo (public/demo/*.svg).
// Chạy: node scripts/generate-demo-images.mjs

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outDir = join(import.meta.dirname, "..", "public", "demo");
mkdirSync(outDir, { recursive: true });

const palettes = {
  navy: ["#0d2e5b", "#1f5fae", "#5fa3f0"],
  teal: ["#0b4f5c", "#138a8a", "#5fd3c4"],
  indigo: ["#24215e", "#4b45b0", "#9d97ff"],
  crimson: ["#5c1220", "#b51f1f", "#ff8a7a"],
  green: ["#123f2b", "#1f7a4d", "#7fd8a4"],
  amber: ["#4a2a06", "#b4690e", "#ffc861"],
  sky: ["#0a3554", "#1479b8", "#7cc8ff"],
};

const W = "#ffffff";

// Mỗi hình minh họa vẽ trong khung 400x400, nét trắng
const icons = {
  network: () => {
    const n = [[80, 120], [200, 60], [320, 130], [140, 250], [270, 270], [60, 330], [340, 340], [200, 170]];
    const e = [[0, 1], [1, 2], [0, 3], [1, 7], [2, 7], [7, 3], [7, 4], [3, 5], [4, 6], [3, 4], [2, 4]];
    return (
      e.map(([a, b]) => `<line x1="${n[a][0]}" y1="${n[a][1]}" x2="${n[b][0]}" y2="${n[b][1]}" stroke="${W}" stroke-opacity=".55" stroke-width="4"/>`).join("") +
      n.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i === 7 ? 26 : 16}" fill="${W}" fill-opacity="${i === 7 ? 1 : 0.85}"/>`).join("") +
      `<circle cx="200" cy="170" r="44" fill="none" stroke="${W}" stroke-opacity=".5" stroke-width="3"/>`
    );
  },
  city: () => {
    const b = [[30, 200, 60], [100, 120, 70], [180, 60, 80], [270, 150, 60], [340, 220, 45]];
    return (
      b
        .map(([x, y, w]) => {
          let s = `<rect x="${x}" y="${y}" width="${w}" height="${380 - y}" rx="6" fill="${W}" fill-opacity=".9"/>`;
          for (let yy = y + 20; yy < 360; yy += 34)
            for (let xx = x + 12; xx < x + w - 14; xx += 22) s += `<rect x="${xx}" y="${yy}" width="10" height="14" rx="2" fill="#000" fill-opacity=".18"/>`;
          return s;
        })
        .join("") +
      `<path d="M220 60 V20 M220 20 l18 10" stroke="${W}" stroke-width="5" stroke-linecap="round"/>` +
      `<line x1="10" y1="382" x2="390" y2="382" stroke="${W}" stroke-width="5" stroke-linecap="round"/>`
    );
  },
  chart: () =>
    [70, 130, 110, 190, 250]
      .map((h, i) => `<rect x="${50 + i * 66}" y="${360 - h}" width="44" height="${h}" rx="8" fill="${W}" fill-opacity="${0.45 + i * 0.12}"/>`)
      .join("") +
    `<polyline points="72,250 138,200 204,215 270,140 336,80" fill="none" stroke="${W}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<path d="M312 78 L340 76 L336 104" fill="none" stroke="${W}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>` +
    [[72, 250], [138, 200], [204, 215], [270, 140]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="10" fill="${W}"/>`).join("") +
    `<line x1="30" y1="362" x2="380" y2="362" stroke="${W}" stroke-width="4" stroke-linecap="round"/>`,
  shield: () =>
    `<path d="M200 30 L340 85 V195 C340 290 275 350 200 382 C125 350 60 290 60 195 V85 Z" fill="${W}" fill-opacity=".92"/>` +
    `<path d="M200 70 L305 112 V195 C305 268 258 316 200 342 Z" fill="#000" fill-opacity=".08"/>` +
    `<polyline points="138,205 185,250 268,160" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>`,
  document: () =>
    `<rect x="120" y="40" width="210" height="280" rx="16" fill="${W}" fill-opacity=".45"/>` +
    `<path d="M80 80 H250 L300 130 V370 Q300 380 290 380 H90 Q80 380 80 370 Z" fill="${W}" fill-opacity=".95"/>` +
    `<path d="M250 80 V130 H300" fill="#000" fill-opacity=".12"/>` +
    [160, 195, 230, 265, 300].map((y, i) => `<rect x="110" y="${y}" width="${i === 4 ? 100 : 160}" height="12" rx="6" fill="#000" fill-opacity=".18"/>`).join("") +
    `<circle cx="250" cy="330" r="26" fill="#d62828" fill-opacity=".85"/>`,
  leaf: () =>
    `<path d="M200 380 C200 300 200 240 205 170" stroke="${W}" stroke-width="10" fill="none" stroke-linecap="round"/>` +
    `<path d="M205 200 C120 210 70 150 70 70 C160 70 215 120 205 200 Z" fill="${W}" fill-opacity=".9"/>` +
    `<path d="M205 240 C280 250 340 200 345 120 C260 115 205 165 205 240 Z" fill="${W}" fill-opacity=".7"/>` +
    `<path d="M80 380 Q200 340 320 380" stroke="${W}" stroke-width="8" fill="none" stroke-linecap="round"/>`,
  health: () =>
    `<path d="M200 350 C100 280 40 220 40 145 C40 90 85 55 130 55 C165 55 190 75 200 100 C210 75 235 55 270 55 C315 55 360 90 360 145 C360 220 300 280 200 350 Z" fill="${W}" fill-opacity=".92"/>` +
    `<polyline points="70,190 140,190 165,140 200,240 230,170 250,190 330,190" fill="none" stroke="#d62828" stroke-width="10" stroke-linejoin="round" stroke-linecap="round"/>`,
  education: () =>
    `<path d="M40 140 Q120 110 200 145 Q280 110 360 140 V340 Q280 310 200 345 Q120 310 40 340 Z" fill="${W}" fill-opacity=".92"/>` +
    `<line x1="200" y1="145" x2="200" y2="345" stroke="#000" stroke-opacity=".15" stroke-width="6"/>` +
    [180, 215, 250, 285].map((y) => `<line x1="70" y1="${y}" x2="170" y2="${y - 8}" stroke="#000" stroke-opacity=".15" stroke-width="6" stroke-linecap="round"/><line x1="230" y1="${y - 8}" x2="330" y2="${y}" stroke="#000" stroke-opacity=".15" stroke-width="6" stroke-linecap="round"/>`).join("") +
    `<path d="M200 30 L320 75 L200 120 L80 75 Z" fill="${W}"/><path d="M290 88 V130" stroke="${W}" stroke-width="6" stroke-linecap="round"/>`,
  people: () =>
    [[110, 0.75, 0.8], [290, 0.75, 0.8], [200, 1, 1]]
      .map(
        ([x, s, o]) =>
          `<g transform="translate(${x} ${s === 1 ? 150 : 175}) scale(${s})"><circle cx="0" cy="0" r="48" fill="${W}" fill-opacity="${o}"/><path d="M-90 210 C-90 120 -50 75 0 75 C50 75 90 120 90 210 Z" fill="${W}" fill-opacity="${o}"/></g>`,
      )
      .join(""),
  cloud: () =>
    `<path d="M110 200 C60 200 40 165 50 135 C60 105 95 92 120 100 C130 55 175 35 215 45 C255 55 275 85 278 110 C320 105 355 135 350 170 C346 195 325 205 300 205 Z" fill="${W}" fill-opacity=".92"/>` +
    [240, 290, 340]
      .map((y) => `<rect x="110" y="${y}" width="180" height="40" rx="8" fill="${W}" fill-opacity=".8"/><circle cx="135" cy="${y + 20}" r="6" fill="#16a34a"/><rect x="160" y="${y + 15}" width="100" height="10" rx="5" fill="#000" fill-opacity=".15"/>`)
      .join("") +
    `<line x1="200" y1="205" x2="200" y2="240" stroke="${W}" stroke-width="6"/>`,
  payment: () => {
    let qr = "";
    const cells = [
      "1111111011", "1000001010", "1011101101", "1011101011", "1000001110",
      "1111111010", "0001000111", "1101011010", "1010110101", "1110101011",
    ];
    cells.forEach((row, r) => [...row].forEach((c, k) => c === "1" && (qr += `<rect x="${150 + k * 14}" y="${120 + r * 14}" width="13" height="13" fill="#000" fill-opacity=".75"/>`)));
    return (
      `<rect x="115" y="40" width="210" height="340" rx="30" fill="${W}" fill-opacity=".95"/>` +
      `<rect x="140" y="110" width="160" height="160" rx="10" fill="${W}"/>` +
      qr +
      `<rect x="160" y="300" width="120" height="34" rx="17" fill="#1f5fae"/>` +
      `<rect x="185" y="58" width="70" height="10" rx="5" fill="#000" fill-opacity=".2"/>`
    );
  },
  map: () =>
    `<path d="M40 110 L140 70 L260 110 L360 70 V320 L260 360 L140 320 L40 360 Z" fill="${W}" fill-opacity=".85"/>` +
    `<path d="M140 70 V320 M260 110 V360" stroke="#000" stroke-opacity=".12" stroke-width="5"/>` +
    `<path d="M80 290 C130 240 170 270 210 220 S300 200 330 150" fill="none" stroke="#1f5fae" stroke-width="7" stroke-dasharray="14 12" stroke-linecap="round"/>` +
    `<path d="M300 40 C340 40 360 70 360 95 C360 130 300 190 300 190 C300 190 240 130 240 95 C240 70 260 40 300 40 Z" fill="#d62828"/><circle cx="300" cy="95" r="20" fill="${W}"/>`,
  ai: () =>
    `<rect x="90" y="90" width="220" height="220" rx="30" fill="${W}" fill-opacity=".92"/>` +
    `<rect x="140" y="140" width="120" height="120" rx="16" fill="#000" fill-opacity=".14"/>` +
    [120, 170, 220, 270].map((p) => `<line x1="${p + 10}" y1="40" x2="${p + 10}" y2="90" stroke="${W}" stroke-width="8" stroke-linecap="round"/><line x1="${p + 10}" y1="310" x2="${p + 10}" y2="360" stroke="${W}" stroke-width="8" stroke-linecap="round"/><line x1="40" y1="${p + 10}" x2="90" y2="${p + 10}" stroke="${W}" stroke-width="8" stroke-linecap="round"/><line x1="310" y1="${p + 10}" x2="360" y2="${p + 10}" stroke="${W}" stroke-width="8" stroke-linecap="round"/>`).join("") +
    `<text x="200" y="222" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="56" fill="#000" fill-opacity=".55">AI</text>`,
};

function background(id, [dark, mid, light], w, h) {
  return `<defs>
  <linearGradient id="g${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${dark}"/><stop offset="1" stop-color="${mid}"/></linearGradient>
  <radialGradient id="r${id}" cx=".85" cy=".2" r=".7"><stop offset="0" stop-color="${light}" stop-opacity=".55"/><stop offset="1" stop-color="${light}" stop-opacity="0"/></radialGradient>
  <pattern id="d${id}" width="36" height="36" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="2" fill="#fff" fill-opacity=".12"/></pattern>
</defs>
<rect width="${w}" height="${h}" fill="url(#g${id})"/>
<rect width="${w}" height="${h}" fill="url(#r${id})"/>
<rect width="${w}" height="${h}" fill="url(#d${id})"/>
<circle cx="${w * 0.08}" cy="${h * 0.95}" r="${h * 0.45}" fill="#fff" fill-opacity=".05"/>
<circle cx="${w * 0.95}" cy="${h * 0.05}" r="${h * 0.3}" fill="#fff" fill-opacity=".06"/>`;
}

/** Ảnh đại diện 16:10 (1600x1000), hình minh họa đặt lệch phải. */
function cover(name, icon, palette) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
${background(name, palettes[palette], 1600, 1000)}
<g transform="translate(560 160) scale(1.7)">${icons[icon]()}</g>
</svg>`;
  writeFileSync(join(outDir, `${name}.svg`), svg);
}

/** Banner 3:1 (1920x640), hình minh họa bên phải để chừa chỗ cho chữ bên trái. */
function banner(name, icon, palette) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 640" preserveAspectRatio="xMidYMid slice">
${background(name, palettes[palette], 1920, 640)}
<g transform="translate(1260 70) scale(1.25)" opacity=".9">${icons[icon]()}</g>
</svg>`;
  writeFileSync(join(outDir, `${name}.svg`), svg);
}

const covers = [
  ["network", "network", "navy"],
  ["city", "city", "indigo"],
  ["chart", "chart", "teal"],
  ["shield", "shield", "crimson"],
  ["document", "document", "sky"],
  ["leaf", "leaf", "green"],
  ["health", "health", "teal"],
  ["education", "education", "amber"],
  ["people", "people", "navy"],
  ["cloud", "cloud", "sky"],
  ["payment", "payment", "indigo"],
  ["map", "map", "green"],
  ["ai", "ai", "indigo"],
];
covers.forEach(([name, icon, palette]) => cover(`cover-${name}`, icon, palette));

banner("banner-1", "network", "navy");
banner("banner-2", "people", "teal");
banner("banner-3", "ai", "indigo");

console.log(`Đã tạo ${covers.length + 3} ảnh trong public/demo`);
