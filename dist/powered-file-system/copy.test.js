"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const chance_1 = __importDefault(require("chance"));
const node_test_1 = require("node:test");
const index_1 = require("../index");
const test_utils_1 = require("../test-utils");
/**
 * Covers file and directory copy behavior, including collision handling.
 */
(0, node_test_1.describe)('copy(src, dir [, options])', () => {
    const chance = new chance_1.default();
    let tmpDir = '';
    (0, node_test_1.beforeEach)(() => {
        tmpDir = (0, test_utils_1.createTmpDir)();
        (0, test_utils_1.fmock)({
            [node_path_1.default.join(tmpDir, 'tings.txt')]: {
                type: 'file',
                data: chance.string()
            },
            [node_path_1.default.join(tmpDir, 'digest')]: { type: 'directory' }
        });
    });
    (0, node_test_1.afterEach)(() => {
        (0, test_utils_1.restore)(tmpDir);
    });
    (0, node_test_1.it)('Positive: Copying a item file', async () => {
        await index_1.pfs.copy(node_path_1.default.join(tmpDir, 'tings.txt'), node_path_1.default.join(tmpDir, 'digest'));
        const exist = node_fs_1.default.existsSync(node_path_1.default.join(tmpDir, 'digest', 'tings.txt'));
        (0, node_assert_1.default)(exist);
    });
    (0, node_test_1.it)('Positive: Recursive copying a directory', async () => {
        await index_1.pfs.copy(node_path_1.default.resolve('./src'), tmpDir);
        const exist = node_fs_1.default.existsSync(node_path_1.default.join(tmpDir, 'src'));
        (0, node_assert_1.default)(exist);
    });
    (0, node_test_1.it)('Negative: Throw if not exists resource', async () => {
        const guid = chance.guid();
        await node_assert_1.default.rejects(async () => {
            await index_1.pfs.copy(node_path_1.default.join(tmpDir, guid), tmpDir);
        });
    });
    (0, node_test_1.it)('Negative: An attempt to copy to an existing resource should return an Error', async () => {
        await node_assert_1.default.rejects(async () => {
            await index_1.pfs.copy(tmpDir, node_path_1.default.dirname(tmpDir));
        });
    });
    (0, node_test_1.it)('[sync] Positive: Copying a file', () => {
        index_1.pfs.copy(node_path_1.default.join(tmpDir, 'tings.txt'), node_path_1.default.join(tmpDir, 'digest'), {
            sync: true
        });
        const exist = node_fs_1.default.existsSync(node_path_1.default.join(tmpDir, 'digest', 'tings.txt'));
        (0, node_assert_1.default)(exist);
    });
    (0, node_test_1.it)('[sync] Positive: Recursive copying a directory', () => {
        index_1.pfs.copy(node_path_1.default.resolve('./src'), tmpDir, {
            sync: true
        });
        const exist = node_fs_1.default.existsSync(node_path_1.default.join(tmpDir, 'src'));
        (0, node_assert_1.default)(exist);
    });
    (0, node_test_1.it)('[sync] Negative: Throw if not exists resource', () => {
        const guid = chance.guid();
        node_assert_1.default.throws(() => {
            index_1.pfs.copy(node_path_1.default.join(tmpDir, guid), tmpDir, {
                sync: true
            });
        });
    });
    (0, node_test_1.it)('[sync] Negative: An attempt to copy to an existing resource should return an Error', () => {
        node_assert_1.default.throws(() => {
            index_1.pfs.copy(tmpDir, node_path_1.default.dirname(tmpDir), {
                sync: true
            });
        });
    });
});
