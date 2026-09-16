#!/usr/bin/env node
/**
 * Launch Electron with ELECTRON_RUN_AS_NODE cleared.
 * Cursor (and some shells) set that var, which makes the Electron binary
 * run as plain Node — require('electron') becomes a path string and the
 * app crashes immediately.
 */
const { spawn } = require('node:child_process');
const path = require('node:path');

delete process.env.ELECTRON_RUN_AS_NODE;

const args = process.argv.slice(2);
const dev = args.includes('--dev');
const forward = args.filter((a) => a !== '--dev');

const env = { ...process.env };
delete env.ELECTRON_RUN_AS_NODE;
if (dev) env.ELECTRON_DEV = '1';

const electronBinary = require('electron');
const appRoot = path.join(__dirname, '..');
const child = spawn(electronBinary, forward.length ? forward : ['.'], {
  cwd: appRoot,
  env,
  stdio: 'inherit',
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});
