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
(0, node_test_1.describe)('rename(src, use [, options])', { concurrency: false }, () => {
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
    (0, node_test_1.it)('Positive: Must be recursive rename file', async () => {
        await index_1.pfs.rename('./tmpdir/tings.txt', './tmpdir/newapp.txt');
        const exist = node_fs_1.default.existsSync('./tmpdir/newapp.txt');
        (0, node_assert_1.default)(exist);
    });
    (0, node_test_1.it)('Positive: Must be recursive rename directory', async () => {
        await index_1.pfs.rename('./tmpdir/digest', './tmpdir/newxbase');
        const exist = node_fs_1.default.existsSync('./tmpdir/newxbase');
        (0, node_assert_1.default)(exist);
    });
    (0, node_test_1.it)('Negative: Throw if not exists resource', async () => {
        const guid = chance.guid();
        await node_assert_1.default.rejects(async () => {
            await index_1.pfs.rename(`./tmpdir/${guid}`, './tmpdir/newxbase');
        });
    });
    (0, node_test_1.it)('[sync] Positive: Must be recursive rename file', () => {
        index_1.pfs.rename('./tmpdir/tings.txt', './tmpdir/newapp.txt', {
            sync: true
        });
        const exist = node_fs_1.default.existsSync('./tmpdir/newapp.txt');
        (0, node_assert_1.default)(exist);
    });
    (0, node_test_1.it)('[sync] Positive: Must be recursive rename directory', () => {
        index_1.pfs.rename('./tmpdir/digest', './tmpdir/newxbase', {
            sync: true
        });
        const exist = node_fs_1.default.existsSync('./tmpdir/newxbase');
        (0, node_assert_1.default)(exist);
    });
    (0, node_test_1.it)('[sync] Negative: Throw if not exists resource', () => {
        const guid = chance.guid();
        node_assert_1.default.throws(() => {
            index_1.pfs.rename(`./tmpdir/${guid}`, './tmpdir/newxbase', {
                sync: true
            });
        });
    });
});
