#!/usr/bin/env node

const { spawn } = require('node:child_process');
const { existsSync } = require('node:fs');
const { resolve } = require('node:path');

const projectRoot = resolve(__dirname, '..', '..', '..');
const mobileDir = resolve(projectRoot, 'mobile');
const cliPath = resolve(mobileDir, 'node_modules', 'expo', 'bin', 'cli');

if (!existsSync(cliPath)) {
  console.error(
    'Expo is not installed in the mobile app yet. Run `npm install --prefix mobile` and try again.'
  );
  process.exit(1);
}

const child = spawn(process.execPath, [cliPath, ...process.argv.slice(2)], {
  cwd: mobileDir,
  stdio: 'inherit',
  env: process.env,
});

child.on('error', (error) => {
  console.error('Failed to start Expo from the mobile app:', error.message);
  process.exit(1);
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
