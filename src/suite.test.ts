import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Recursively collects compiled test files emitted into `dist/`.
 */
function collectTestFiles(dir: string): string[] {
  let files: string[] = [];

  for (const entry of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (entry === 'src' || entry === 'test') {
        continue;
      }

      files = files.concat(
        collectTestFiles(fullPath)
      );
    }
    else if (/\.test\.js$/.test(entry)) {
      files.push(fullPath);
    }
  }

  return files;
}

// The compiled output directory is the root for the test runner.
const distDir = path.resolve(__dirname);

// The runner skips itself and forwards the rest to Node's native test harness.
const testFiles = collectTestFiles(distDir).filter((file) => file !== __filename);

if (!testFiles.length) {
  console.warn("⚠️  No test files found in dist/");
  process.exit(0);
}

const { status } = spawnSync(process.execPath, ['--test', ...testFiles], {
  stdio: 'inherit'
});

process.exitCode = status ?? 1;
