"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_path_1 = __importDefault(require("node:path"));
const chance_1 = __importDefault(require("chance"));
const node_test_1 = require("node:test");
const index_1 = require("../index");
const test_utils_1 = require("../test-utils");
/**
 * Ensures `stat()` preserves file type reporting for files, directories, and symlinks.
 */
(0, node_test_1.describe)('stat(src [, options])', () => {
    const chance = new chance_1.default();
    let tmpDir = '';
    (0, node_test_1.beforeEach)(() => {
        tmpDir = (0, test_utils_1.createTmpDir)();
        (0, test_utils_1.fmock)({
            [node_path_1.default.join(tmpDir, 'tings.txt')]: {
                type: 'file',
                data: chance.string()
            },
            [node_path_1.default.join(tmpDir, 'digest')]: { type: 'directory' },
            [node_path_1.default.join(tmpDir, 'flexapp')]: {
                type: 'symlink',
                target: node_path_1.default.join(tmpDir, 'tings.txt')
            }
        });
    });
    (0, node_test_1.afterEach)(() => {
        (0, test_utils_1.restore)(tmpDir);
    });
    (0, node_test_1.it)('Positive: Must return information a file', async () => {
        const stats = await index_1.pfs.stat(node_path_1.default.join(tmpDir, 'tings.txt'));
        (0, node_assert_1.default)(stats.isFile());
    });
    (0, node_test_1.it)('Positive: Must return information a directory', async () => {
        const stats = await index_1.pfs.stat(node_path_1.default.join(tmpDir, 'digest'));
        (0, node_assert_1.default)(stats.isDirectory());
    });
    (0, node_test_1.it)('Positive: Must return information a symlink', async () => {
        const stats = await index_1.pfs.stat(node_path_1.default.join(tmpDir, 'flexapp'));
        (0, node_assert_1.default)(stats.isSymbolicLink());
    });
    (0, node_test_1.it)('Negative: Throw if not exists resource', async () => {
        const guid = chance.guid();
        await node_assert_1.default.rejects(async () => {
            await index_1.pfs.stat(node_path_1.default.join(tmpDir, guid));
        });
    });
    (0, node_test_1.it)('[sync] Positive: Must return information a file', () => {
        const stats = index_1.pfs.stat(node_path_1.default.join(tmpDir, 'tings.txt'), {
            sync: true
        });
        (0, node_assert_1.default)(stats.isFile());
    });
    (0, node_test_1.it)('[sync] Positive: Must return information a directory in ', () => {
        const stats = index_1.pfs.stat(node_path_1.default.join(tmpDir, 'digest'), {
            sync: true
        });
        (0, node_assert_1.default)(stats.isDirectory());
    });
    (0, node_test_1.it)('[sync] Positive: Must return information a symlink', () => {
        const stats = index_1.pfs.stat(node_path_1.default.join(tmpDir, 'flexapp'), {
            sync: true
        });
        (0, node_assert_1.default)(stats.isSymbolicLink());
    });
    (0, node_test_1.it)('[sync] Negative: Throw if not exists resource', () => {
        const guid = chance.guid();
        node_assert_1.default.throws(() => {
            index_1.pfs.stat(node_path_1.default.join(tmpDir, guid), {
                sync: true
            });
        });
    });
});
