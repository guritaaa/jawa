#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const packageJson = require('../package.json');

// Kamus terpusat JawaScript -> JavaScript
const kamus = [
    { from: /\bliyane\s+yen\b/g, to: 'else if' },
    { from: /\bkonstanta\b/g, to: 'const' },
    { from: /\bjarke\b/g, to: 'let' },
    { from: /\bbutuh\b/g, to: 'require' },
    { from: /\basinkron\b/g, to: 'async' },
    { from: /\benteni\b/g, to: 'await' },
    { from: /\bfungsi\b/g, to: 'function' },
    { from: /\bbali\b/g, to: 'return' },
    { from: /\byen\b/g, to: 'if' },
    { from: /\bliyane\b/g, to: 'else' },
    { from: /\bbener\b/g, to: 'true' },
    { from: /\bsalah\b/g, to: 'false' },
    { from: /\bnyetak\b/g, to: 'console.log' },
    { from: /\banyar\b/g, to: 'new' },
    { from: /\bcoba\b/g, to: 'try' },
    { from: /\bcekel\b/g, to: 'catch' },
    { from: /\baturWektu\b/g, to: 'setTimeout' },
    { from: /\baturInterval\b/g, to: 'setInterval' },
    { from: /\bpilih\b/g, to: 'switch' },
    { from: /\bkasus\b/g, to: 'case' },
    { from: /\bmandheg\b/g, to: 'break' },
    { from: /\bbaku\b/g, to: 'default' },
    { from: /\bmodul\b/g, to: 'module' },
    { from: /\bekspor\b/g, to: 'exports' },
    { from: /\bkanggo\b/g, to: 'for' }
];

function kompilasiJawa(kode) {
    return kode.replace(/(\/\/.*|\/\*[\s\S]*?\*\/|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`)|([a-zA-Z_$][a-zA-Z0-9_$]*|\s+)/g, (match, isStringOrComment) => {
        if (isStringOrComment) return match;
        for (const item of kamus) {
            match = match.replace(item.from, item.to);
        }
        return match;
    });
}

global.kompilasiJawa = kompilasiJawa;

require.extensions['.jawa'] = function(module, filename) {
    const kontenAsli = fs.readFileSync(filename, 'utf-8');
    const kontenJS = kompilasiJawa(kontenAsli);
    module._compile(kontenJS, filename);
};

// Ambil argumen dari terminal
const args = process.argv.slice(2);
const targetArg = args[0];

// 1. Jika mengetik 'jawa' kosong tanpa argumen
if (!targetArg) {
    console.error(`\x1b[31m[JawaScript Error] Waduh, kok mung ngetik 'jawa' doang, Lur? Ora ana file sing dieksekusi!\x1b[0m`);
    console.log(`\x1b[33m💡 Ketik 'jawa --help' kanggo ndeleng panduan lengkap.\x1b[0m`);
    process.exit(1);
}

// 2. Command untuk Versi (-v atau --version)
if (targetArg === '-v' || targetArg === '--version') {
    console.log(`☕ JawaScript CLI Versi: \x1b[32m${packageJson.version}\x1b[0m`);
    process.exit(0);
}

// 3. Command untuk Bantuan (-h atau --help) -> [SUDAH DIPERBAIKI DENGAN TANDA KUTIP]
if (targetArg === '-h' || targetArg === '--help') {
    console.log(`
\x1b[36m┌──────────────────────────────────────────────┐\x1b[0m
\x1b[36m│          ☕ JAWASCRIPT CLI HELP              │\x1b[0m
\x1b[36m└──────────────────────────────────────────────┘\x1b[0m
\x1b[33mCara Penggunaan:\x1b[0m
  jawa <namafile>          Jalankan file (.jawa, tanpa ekstensi, atau dobel ekstensi)

\x1b[33mDaftar Command / Opsi Lainnya:\x1b[0m
  \x1b[32m-v, --version\x1b[0m          Ndeleng versi CLI saiki
  \x1b[32m-h, --help\x1b[0m             Ndeleng panduan bantuan iki
  \x1b[32m-d, --daftar-kamus\x1b[0m     Ndeleng daftar terjemahan sintaks

\x1b[33mContoh Sederhana:\x1b[0m
  jawa index
  jawa index.jawa
  jawa script.js.jawa
    `);
    process.exit(0);
}

// 4. Command Daftar Kamus (-d atau --daftar-kamus)
if (targetArg === '-d' || targetArg === '--daftar-kamus') {
    console.log(`\x1b[35m📜 Daftar Kamus JawaScript -> JavaScript:\x1b[0m`);
    kamus.forEach(item => {
        let dari = item.from.source.replace(/\\b/g, '').replace(/\\s\+/g, ' ');
        console.log(`  • \x1b[33m${dari}\x1b[0m  ➔  \x1b[32m${item.to}\x1b[0m`);
    });
    process.exit(0);
}

// 5. Logika Pengecekan File Cerdas (Bypass & Fleksibel)
const basePath = path.resolve(process.cwd(), targetArg);
let filePath = null;

const kandidatFile = [
    basePath,
    basePath + '.jawa',
];

for (const kandidat of kandidatFile) {
    if (fs.existsSync(kandidat) && fs.statSync(kandidat).isFile()) {
        filePath = kandidat;
        break;
    }
}

if (!filePath) {
    console.error(`\x1b[31m[JawaScript Error] Waduh, file "${targetArg}" ora ketemu (baik dengan atau tanpa ekstensi)!\x1b[0m`);
    console.log(`\x1b[33m💡 Ketik 'jawa --help' kanggo ndeleng panduan.\x1b[0m`);
    process.exit(1);
}

require(filePath);
