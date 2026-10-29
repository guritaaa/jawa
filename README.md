# 🐙 JawaScript (`.jawa`)

![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-orange.svg)

> **JawaScript** adalah *compiler* dan *interpreter* berbasis Node.js yang memungkinkan (dan memaksa!) kamu ngoding menggunakan sintaks bahasa Jawa murni dengan ekstensi `.jawa`. Dibekali fitur **Strict Mode** yang akan menolak sintaks JavaScript standar layaknya *error* bawaan V8 Engine! ☕🔥

---

## ✨ Fitur Utama

1. **100% Berbasis Node.js V8 Engine:** Di balik layar, kode `.jawa` diterjemahkan secara *on-the-fly* ke JavaScript standar. Semua fitur modern dan package NPM (seperti `baileys` untuk Bot WhatsApp, `express`, `axios`, dll) dapat berjalan 100% normal.
2. **Strict Mode ("Anti-JS Asli"):** Mengharamkan penggunaan kata kunci JavaScript murni (`let`, `const`, `if`, `console.log`, dll) di dalam file `.jawa`. Jika nekat dipakai, *compiler* akan melempar *error* persis seperti Node.js asli:
   ```text
   ReferenceError: let is not defined
       at kompilasiJawa (/usr/lib/node_modules/jawascript-cli/index.js:1:1)
   ```
3. **Dukungan Modular Penuh (`butuh`):** Bisa mengimpor file `.jawa` lain menggunakan `butuh('./namaFile')`. Seluruh file yang diimpor juga otomatis melewati pemeriksaan Strict Mode.
4. **Siap Tempur di Termux & Pterodactyl:** Dilengkapi CLI (`jawa <namafile>`) dan *runner* yang bisa langsung dipanggil di **Startup Command** panel Pterodactyl tanpa perlu membuat file perantara (`index.js` atau `main.js`).

---

## 📖 Kamus Bahasa JawaScript

### 1. Kata Kunci Dasar (Keywords)

| JawaScript | JavaScript Asli | Keterangan |
| :--- | :--- | :--- |
| `jarke` | `let` | Deklarasi variabel yang nilainya bisa diubah |
| `konstanta` | `const` | Deklarasi variabel konstan (tetap) |
| `fungsi` | `function` | Mendeklarasikan fungsi |
| `bali` | `return` | Mengembalikan nilai dari fungsi |
| `yen` | `if` | Percabangan kondisi jika benar |
| `liyane yen` | `else if` | Percabangan kondisi alternatif |
| `liyane` | `else` | Kondisi terakhir jika semua salah |
| `pilih` / `kasus` | `switch` / `case` | Percabangan *switch-case* |
| `mandheg` / `baku` | `break` / `default` | Menghentikan *switch/loop* & nilai bawaan |
| `kanggo` | `for` | Perulangan (*looping*) |
| `asinkron` / `enteni` | `async` / `await` | Menangani proses asinkronus (*Promise*) |
| `coba` / `cekel` | `try` / `catch` | Menangani *error* (*error handling*) |
| `butuh` | `require` | Memanggil modul NPM atau file `.jawa` lain |
| `modul` / `ekspor` | `module` / `exports` | Mengekspor fungsi atau variabel ke file lain |
| `nyetak` | `console.log` | Mencetak teks/data ke layar terminal |
| `anyar` | `new` | Membuat *instance* objek baru |
| `bener` / `salah` | `true` / `false` | Nilai boolean |
| `kosong` / `orahNduwe` | `null` / `undefined` | Nilai kosong atau belum terdefinisi |
| `aturWektu` | `setTimeout` | Menjalankan kode setelah jeda waktu tertentu |
| `aturInterval` | `setInterval` | Menjalankan kode berulang setiap interval waktu |

### 2. Method & Properti Bawaan (String / Array)

| JawaScript | JavaScript Asli | Contoh Penggunaan |
| :--- | :--- | :--- |
| `.awale()` | `.startsWith()` | `pesan.awale(".menu")` |
| `.pungkasane()` | `.endsWith()` | `nomor.pungkasane("@s.whatsapp.net")` |
| `.motret()` | `.includes()` | `teks.motret("admin")` |
| `.nok()` | `.indexOf()` | `daftar.nok("budi")` |
| `.ganti()` | `.replace()` | `teks.ganti("lama", "anyar")` |
| `.pisah()` | `.split()` | `kalimat.pisah(" ")` |
| `.gabung()` | `.join()` | `arrayKata.gabung(", ")` |
| `.tekan` | `.length` | `teks.tekan` |
| `.iman()` | `.push()` | `daftar.iman("item_anyar")` |
| `.copot()` | `.pop()` | `daftar.copot()` |

---

## 📦 Instalasi

### Instalasi Global (Untuk Termux / VPS)
Gunakan perintah berikut agar perintah `jawa` bisa dipanggil dari folder mana saja:

```bash
npm i -g github:guritaaa/jawa
```

### Instalasi Lokal (Untuk Project Bot / Pterodactyl)
Jalankan di dalam folder project kamu:

```bash
npm i jawa@github:guritaaa/jawa
```

---

## 💻 Contoh Penggunaan

### 1. Membuat Modul (`setelan.jawa`)
```javascript
konstanta namaBot = "Gurita Bot WA";

fungsi sapa(jeneng) {
    bali "Sugeng rawuh ing " + namaBot + ", Lur " + jeneng + "!";
}

modul.ekspor = {
    namaBot,
    sapa
};
```

### 2. Membuat File Utama (`index.jawa`)
```javascript
konstanta setelan = butuh('./setelan');

jarke pesanMasuk = "!ping";

yen (pesanMasuk.awale("!")) {    nyetak("Panjang karakter pesan: " + pesanMasuk.tekan);
} liyane {
    nyetak("Ora ana perintah sing cocok.");
}
```

### 3. Menjalankan Kode di Terminal
Cukup panggil dengan perintah `jawa` diikuti nama file (tanpa perlu menulis ekstensi `.jawa`):

```bash
jawa index
```

---

## 🎮 Cara Pasang di Panel Pterodactyl (Tanpa File `.js` Tambahan!)

Kamu tidak perlu membuat file jembatan seperti `main.js` atau `jawa.js` di dalam server Pterodactyl.

1. Pastikan `github:guritaaa/jawa` sudah terdaftar di `package.json` project bot kamu, atau jalankan `npm i jawa@github:guritaaa/jawa`.
2. Buka tab **Startup** di panel Pterodactyl.
3. Ubah **Startup Command** menjadi seperti ini:
   ```bash
   node node_modules/jawa/bin/cli.js index
   ```
   *(Catatan: Ganti kata `index` di paling belakang jika file utama kamu bernama lain, misalnya `kasus` untuk `kasus.jawa`).*
4. Jalankan server (**Start**), dan bot JawaScript kamu langsung mengudara!

---

## 👨‍💻 Kontributor & Lisensi

* **Author:** gurita darat
* **Lisensi:** [MIT License](LICENSE) — Bebas digunakan dan dikembangkan untuk memajukan dunia per-kodingan lokal! ☕🐙
