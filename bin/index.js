const fs = require('fs');
const path = require('path');

// Kamus terpusat JawaScript -> JavaScript
const kamus = [
    // --- Kata Kunci Dasar ---
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
    { from: /\bkanggo\b/g, to: 'for' },

    // --- Method / Fungsi Bawaan ---
    { from: /\bawale\b/g, to: 'startsWith' },
    { from: /\bpungkasane\b/g, to: 'endsWith' },
    { from: /\bmotret\b/g, to: 'includes' },
    { from: /\bnok\b/g, to: 'indexOf' },
    { from: /\bganti\b/g, to: 'replace' },
    { from: /\bpisah\b/g, to: 'split' },
    { from: /\bgabung\b/g, to: 'join' },
    { from: /\btekan\b/g, to: 'length' },
    { from: /\borahNduwe\b/g, to: 'undefined' },
    { from: /\bkosong\b/g, to: 'null' },
    { from: /\biman\b/g, to: 'push' },
    { from: /\bcopot\b/g, to: 'pop' }
];

// 🚫 DAFTAR KATA TERLARANG (Pura-pura "is not defined" ala JS asli kalau pakai JS murni)
const kataTerlarang = [
    { regex: /\bconsole\.log\b/g, nama: 'console' },
    { regex: /\blet\b/g, nama: 'let' },
    { regex: /\bconst\b/g, nama: 'const' },
    { regex: /\bvar\b/g, nama: 'var' },
    { regex: /\bfunction\b/g, nama: 'function' },
    { regex: /\breturn\b/g, nama: 'return' },
    { regex: /\bif\b/g, nama: 'if' },
    { regex: /\belse\b/g, nama: 'else' },
    { regex: /\btrue\b/g, nama: 'true' },
    { regex: /\bfalse\b/g, nama: 'false' }
];

function kompilasiJawa(kode) {
    // 1. Bersihkan string dan komentar dari pengecekan agar tidak salah deteksi
    let kodeBersih = kode.replace(/(\/\/.*|\/\*[\s\S]*?\*\/|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`)/g, '""');

    // 2. Cek apakah ada kata JS asli yang nyempil
    for (const item of kataTerlarang) {
        if (item.regex.test(kodeBersih)) {
            console.error(`ReferenceError: ${item.nama} is not defined`);
            console.error(`    at kompilasiJawa (${__filename}:1:1)`);
            process.exit(1);
        }
    }

    // 3. Lakukan terjemahan kamus JawaScript
    return kode.replace(/(\/\/.*|\/\*[\s\S]*?\*\/|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`)|([a-zA-Z_$][a-zA-Z0-9_$]*|\s+)/g, (match, isStringOrComment) => {
        if (isStringOrComment) return match;
        for (const item of kamus) {
            match = match.replace(item.from, item.to);
        }
        return match;
    });
}

// Daftarkan ekstensi .jawa secara otomatis
require.extensions['.jawa'] = function(module, filename) {
    const kontenAsli = fs.readFileSync(filename, 'utf-8');
    const kontenJS = kompilasiJawa(kontenAsli);
    module._compile(kontenJS, filename);
};

/**
 * Fungsi START cerdas untuk Pterodactyl / Server Lokal
 * @param {string} [namaFile] - Nama file opsional (contoh: "index" atau "bot")
 */
function start(namaFile) {
    const target = namaFile || 'index';
    let basePath;

    // Deteksi apakah dipanggil dari main.js root atau dari bin CLI
    try {
        basePath = path.resolve(path.dirname(require.main.filename), target);
    } catch (e) {
        basePath = path.resolve(process.cwd(), target);
    }
    
    let filePath = null;
    const kandidatFile = [
        basePath,
        basePath + '.jawa',
        basePath + '.js.jawa'
    ];

    for (const kandidat of kandidatFile) {
        if (fs.existsSync(kandidat) && fs.statSync(kandidat).isFile()) {
            filePath = kandidat;
            break;
        }
    }

    if (!filePath) {
        console.error(`\x1b[31m[JawaScript Error] Waduh, file utama "${target}" ora ketemu, Lur!\x1b[0m`);
        process.exit(1);
    }

    require(filePath);
}

// Export modul agar fleksibel (bisa untuk CLI maupun modul library)
module.exports = {
    kompilasiJawa,
    start
};
