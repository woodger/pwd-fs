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
 * Verifies directory cleanup while preserving the directory itself.
 */
(0, node_test_1.describe)('emptyDir(src [, options])', () => {
    const chance = new chance_1.default();
    let tmpDir = '';
    (0, node_test_1.beforeEach)(() => {
        tmpDir = (0, test_utils_1.createTmpDir)();
        const frame = {
            [node_path_1.default.join(tmpDir, 'tings.txt')]: {
                type: 'file',
                data: chance.string()
            },
            [node_path_1.default.join(tmpDir, 'digest')]: { type: 'directory' },
            [node_path_1.default.join(tmpDir, 'digest', 'nested.txt')]: {
                type: 'file',
                data: chance.string()
            }
        };
        (0, test_utils_1.fmock)(frame);
    });
    (0, node_test_1.afterEach)(() => {
        (0, test_utils_1.restore)(tmpDir);
    });
    (0, node_test_1.it)('Positive: Removes all directory contents but preserves the directory', async () => {
        await index_1.pfs.emptyDir(tmpDir);
        (0, node_assert_1.default)(node_fs_1.default.existsSync(tmpDir));
        node_assert_1.default.deepStrictEqual(node_fs_1.default.readdirSync(tmpDir), []);
    });
    (0, node_test_1.it)('Negative: Throw if resource is not directory', async () => {
        await node_assert_1.default.rejects(async () => {
            await index_1.pfs.emptyDir(node_path_1.default.join(tmpDir, 'tings.txt'));
        });
    });
    (0, node_test_1.it)('[sync] Positive: Removes all directory contents but preserves the directory', () => {
        index_1.pfs.emptyDir(tmpDir, {
            sync: true
        });
        (0, node_assert_1.default)(node_fs_1.default.existsSync(tmpDir));
        node_assert_1.default.deepStrictEqual(node_fs_1.default.readdirSync(tmpDir), []);
    });
    (0, node_test_1.it)('[sync] Negative: Throw if resource is not directory', () => {
        node_assert_1.default.throws(() => {
            index_1.pfs.emptyDir(node_path_1.default.join(tmpDir, 'tings.txt'), {
                sync: true
            });
        });
    });
});
