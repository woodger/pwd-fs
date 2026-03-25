"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_child_process_1 = require("node:child_process");
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
/**
 * Рекурсивно собирает все файлы с расширением `.test.js`
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
// Путь к папке с собранными файлами
const distDir = node_path_1.default.resolve(__dirname);
// Собираем все тестовые файлы
const testFiles = collectTestFiles(distDir).filter((file) => file !== __filename);
if (!testFiles.length) {
    console.warn("⚠️  No test files found in dist/");
    process.exit(0);
}
const { status } = (0, node_child_process_1.spawnSync)(process.execPath, ['--test', '--test-concurrency=1', ...testFiles], {
    stdio: 'inherit'
});
process.exitCode = status ?? 1;
