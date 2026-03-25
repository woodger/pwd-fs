"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_child_process_1 = require("node:child_process");
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
/**
 * Recursively collects compiled test files emitted into `dist/`.
 */
function collectTestFiles(dir) {
    let files = [];
    for (const entry of node_fs_1.default.readdirSync(dir)) {
        const fullPath = node_path_1.default.join(dir, entry);
        const stat = node_fs_1.default.statSync(fullPath);
        if (stat.isDirectory()) {
            if (entry === 'src' || entry === 'test') {
                continue;
            }
            files = files.concat(collectTestFiles(fullPath));
        }
        else if (/\.test\.js$/.test(entry)) {
            files.push(fullPath);
        }
    }
    return files;
}
// The compiled output directory is the root for the test runner.
const distDir = node_path_1.default.resolve(__dirname);
// The runner skips itself and forwards the rest to Node's native test harness.
const testFiles = collectTestFiles(distDir).filter((file) => file !== __filename);
if (!testFiles.length) {
    console.warn("⚠️  No test files found in dist/");
    process.exit(0);
}
const { status } = (0, node_child_process_1.spawnSync)(process.execPath, ['--test', ...testFiles], {
    stdio: 'inherit'
});
process.exitCode = status ?? 1;
