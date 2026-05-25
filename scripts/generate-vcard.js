/**
 * Generates the digital business card assets for /vcard/:
 *   1. src/assets/card/andon-goshev.vcf  — vCard 3.0 with embedded photo
 *   2. src/assets/images/card-qr.png      — branded QR code (raster, 1200×1200)
 *   3. src/assets/images/card-qr.svg      — branded QR code (vector, for print)
 *
 * Re-run with:   node scripts/generate-vcard.js
 */
const fs = require("node:fs");
const path = require("node:path");
const QRCode = require("qrcode");

const ROOT = path.resolve(__dirname, "..");
const PHOTO_SRC = path.join(ROOT, "src/assets/images/andon.jpg");
const VCF_OUT   = path.join(ROOT, "src/assets/card/andon-goshev.vcf");
const QR_PNG    = path.join(ROOT, "src/assets/images/card-qr.png");
const QR_SVG    = path.join(ROOT, "src/assets/images/card-qr.svg");

const VCARD_URL = "https://www.webstudio28.com/vcard/";

// Brand colors (must keep enough contrast for reliable scanning)
const QR_DARK  = "#0B1626"; // deep navy (foreground)
const QR_LIGHT = "#FFFFFF"; // light background

// ── vCard line folding (RFC 2426 / 6350) ───────────────────
// Lines longer than 75 octets are folded with CRLF + a single space.
function foldLine(line) {
  if (line.length <= 75) return line;
  const out = [];
  let i = 0;
  out.push(line.slice(i, i + 75));
  i += 75;
  while (i < line.length) {
    out.push(" " + line.slice(i, i + 74));
    i += 74;
  }
  return out.join("\r\n");
}

function buildVcard() {
  const photo = fs.readFileSync(PHOTO_SRC).toString("base64");

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "PRODID:-//WebStudio28//Andon Goshev//EN",
    "N:Goshev;Andon;;;",
    "FN:Andon Goshev",
    "ORG:WebStudio28",
    "TITLE:Founder",
    "TEL;TYPE=CELL,VOICE:+359892907007",
    "EMAIL;TYPE=INTERNET:bgwebstudio28@gmail.com",
    "URL:https://www.webstudio28.com",
    "URL;TYPE=Instagram:https://www.instagram.com/p/DL6n0hYt7q2/",
    "URL;TYPE=TikTok:https://www.tiktok.com/@webstudio28",
    "URL;TYPE=Facebook:https://www.facebook.com/profile.php?id=61578641398876",
    "ADR;TYPE=WORK:;;Bul. Vasil Aprilov 49;Plovdiv;;;Bulgaria",
    `PHOTO;ENCODING=b;TYPE=JPEG:${photo}`,
    "NOTE:Digital business card · WebStudio28",
    `REV:${new Date().toISOString().replace(/\.\d+Z$/, "Z")}`,
    "END:VCARD",
  ];

  return lines.map(foldLine).join("\r\n") + "\r\n";
}

async function writeVcard() {
  fs.mkdirSync(path.dirname(VCF_OUT), { recursive: true });
  const content = buildVcard();
  fs.writeFileSync(VCF_OUT, content, "utf8");
  return content.length;
}

async function writeQrPng() {
  await QRCode.toFile(QR_PNG, VCARD_URL, {
    type: "png",
    errorCorrectionLevel: "H",
    margin: 2,
    width: 1200,
    color: { dark: QR_DARK, light: QR_LIGHT },
  });
}

async function writeQrSvg() {
  const svg = await QRCode.toString(VCARD_URL, {
    type: "svg",
    errorCorrectionLevel: "H",
    margin: 2,
    color: { dark: QR_DARK, light: QR_LIGHT },
  });
  fs.writeFileSync(QR_SVG, svg, "utf8");
}

(async () => {
  const vcfSize = await writeVcard();
  await writeQrPng();
  await writeQrSvg();
  const pngSize = fs.statSync(QR_PNG).size;
  const svgSize = fs.statSync(QR_SVG).size;
  console.log("Generated vCard:  " + VCF_OUT + "  (" + (vcfSize / 1024).toFixed(1) + " KB)");
  console.log("Generated QR PNG: " + QR_PNG  + "  (" + (pngSize / 1024).toFixed(1) + " KB)");
  console.log("Generated QR SVG: " + QR_SVG  + "  (" + (svgSize / 1024).toFixed(1) + " KB)");
  console.log("QR points to: " + VCARD_URL);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
