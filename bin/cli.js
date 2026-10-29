#!/usr/bin/env node
const { start } = require('../index.js');

// Ambil argumen dari terminal / Pterodactyl (default 'index')
const args = process.argv.slice(2);
const target = args[0] || 'index';

// Jalankan menggunakan fungsi start
start(target);
