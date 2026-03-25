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
(0, node_test_1.describe)('chown(src, [, options])', () => {
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
    (0, node_test_1.it)('Positive: Changes the permissions of a file', async () => {
        const filePath = node_path_1.default.join(tmpDir, 'tings.txt');
        const { uid, gid } = node_fs_1.default.statSync(filePath);
        await index_1.pfs.chown(filePath, { uid, gid });
        (0, node_assert_1.default)(node_fs_1.default.existsSync(filePath));
    });
    (0, node_test_1.it)('Positive: Changes the permissions of a directory', async () => {
        const dirPath = node_path_1.default.join(tmpDir, 'digest');
        const { uid, gid } = node_fs_1.default.statSync(dirPath);
        await index_1.pfs.chown(dirPath, { uid, gid });
        (0, node_assert_1.default)(node_fs_1.default.existsSync(dirPath));
    });
    (0, node_test_1.it)('Negative: To a non-existent resource to return an Error', async () => {
        const guid = chance.guid();
        const { uid, gid } = node_fs_1.default.statSync(node_path_1.default.join(tmpDir, 'tings.txt'));
        await node_assert_1.default.rejects(async () => {
            await index_1.pfs.chown(node_path_1.default.join(tmpDir, guid), { uid, gid });
        });
    });
    (0, node_test_1.it)('[sync] Positive: Changes the permissions of a file', () => {
        const filePath = node_path_1.default.join(tmpDir, 'tings.txt');
        const { uid, gid } = node_fs_1.default.statSync(filePath);
        index_1.pfs.chown(filePath, {
            sync: true,
            uid,
            gid
        });
        (0, node_assert_1.default)(node_fs_1.default.existsSync(filePath));
    });
    (0, node_test_1.it)('[sync] Positive: Changes the permissions of a directory', () => {
        const dirPath = node_path_1.default.join(tmpDir, 'digest');
        const { uid, gid } = node_fs_1.default.statSync(dirPath);
        index_1.pfs.chown(dirPath, {
            sync: true,
            uid,
            gid
        });
        (0, node_assert_1.default)(node_fs_1.default.existsSync(dirPath));
    });
    (0, node_test_1.it)('[sync] Negative: To a non-existent resource to return an Error', () => {
        const guid = chance.guid();
        const { uid, gid } = node_fs_1.default.statSync(node_path_1.default.join(tmpDir, 'tings.txt'));
        node_assert_1.default.throws(() => {
            index_1.pfs.chown(node_path_1.default.join(tmpDir, guid), {
                sync: true,
                uid,
                gid
            });
        });
    });
});
