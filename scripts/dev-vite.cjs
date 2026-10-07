#!/usr/bin/env node
/**
 * Start the local Vite binary without npx/npm.
 * Cursor sets npm_config_devdir (a node-gyp path). npm 11 treats that as an
 * unknown config and prints a warning on every `npx vite` / `npm run`.
 */
const { execSync, spawn } = require('node:child_process');
const path = require('node:path');

const PORT = 5174;

function pidsOnPort(port) {
  try {
    const out = execSync(`lsof -tiTCP:${port} -sTCP:LISTEN`, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return out ? out.split(/\s+/).filter(Boolean) : [];
  } catch {
    return [];
  }
}

const blockers = pidsOnPort(PORT);
if (blockers.length) {
  console.error(
    `[aso] Port ${PORT} is already in use (PID ${blockers.join(', ')}).\n` +
      `      That is usually a leftover Vite. Stop it, then retry:\n` +
      `        kill ${blockers.join(' ')}\n` +
      `        npm run dev`,
  );
  process.exit(1);
}

const env = { ...process.env };
delete env.ELECTRON_RUN_AS_NODE;
delete env.npm_config_devdir;
delete env.NPM_CONFIG_DEVDIR;

const appRoot = path.join(__dirname, '..');
const viteJs = path.join(appRoot, 'node_modules', 'vite', 'bin', 'vite.js');

const child = spawn(process.execPath, [viteJs, ...process.argv.slice(2)], {
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
