"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_fs_1 = __importDefault(require("node:fs"));
const chance_1 = __importDefault(require("chance"));
const node_test_1 = require("node:test");
const index_1 = require("../index");
const test_utils_1 = require("../test-utils");
(0, node_test_1.describe)('chown(src, [, options])', { concurrency: false }, () => {
    const chance = new chance_1.default();
    (0, node_test_1.beforeEach)(() => {
        (0, test_utils_1.fmock)({
            './tmpdir/tings.txt': {
                type: 'file',
                data: chance.string()
            },
            './tmpdir/digest/': { type: 'directory' }
        });
    });
    (0, node_test_1.afterEach)(() => {
        (0, test_utils_1.restore)('./tmpdir');
    });
    (0, node_test_1.it)('Positive: Changes the permissions of a file', async () => {
        const { uid, gid } = node_fs_1.default.statSync('./tmpdir/tings.txt');
        await index_1.pfs.chown('./tmpdir/tings.txt', { uid, gid });
        (0, node_assert_1.default)(node_fs_1.default.existsSync('./tmpdir/tings.txt'));
    });
    (0, node_test_1.it)('Positive: Changes the permissions of a directory', async () => {
        const { uid, gid } = node_fs_1.default.statSync('./tmpdir/digest');
        await index_1.pfs.chown('./tmpdir/digest', { uid, gid });
        (0, node_assert_1.default)(node_fs_1.default.existsSync('./tmpdir/digest'));
    });
    (0, node_test_1.it)('Negative: To a non-existent resource to return an Error', async () => {
        const guid = chance.guid();
        const { uid, gid } = node_fs_1.default.statSync('./tmpdir/tings.txt');
        await node_assert_1.default.rejects(async () => {
            await index_1.pfs.chown(`./tmpdir/${guid}`, { uid, gid });
        });
    });
    (0, node_test_1.it)('[sync] Positive: Changes the permissions of a file', () => {
        const { uid, gid } = node_fs_1.default.statSync('./tmpdir/tings.txt');
        index_1.pfs.chown('./tmpdir/tings.txt', {
            sync: true,
            uid,
            gid
        });
        (0, node_assert_1.default)(node_fs_1.default.existsSync('./tmpdir/tings.txt'));
    });
    (0, node_test_1.it)('[sync] Positive: Changes the permissions of a directory', () => {
        const { uid, gid } = node_fs_1.default.statSync('./tmpdir/digest');
        index_1.pfs.chown('./tmpdir/digest', {
            sync: true,
            uid,
            gid
        });
        (0, node_assert_1.default)(node_fs_1.default.existsSync('./tmpdir/digest'));
    });
    (0, node_test_1.it)('[sync] Negative: To a non-existent resource to return an Error', () => {
        const guid = chance.guid();
        const { uid, gid } = node_fs_1.default.statSync('./tmpdir/tings.txt');
        node_assert_1.default.throws(() => {
            index_1.pfs.chown(`./tmpdir/${guid}`, {
                sync: true,
                uid,
                gid
            });
        });
    });
});
