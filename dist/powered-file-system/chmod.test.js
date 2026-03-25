"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const chance_1 = __importDefault(require("chance"));
const node_test_1 = require("node:test");
const index_1 = require("../index");
const test_utils_1 = require("../test-utils");
(0, node_test_1.describe)('chmod(src, mode [, options])', () => {
    const chance = new chance_1.default();
    (0, node_test_1.beforeEach)(() => {
        (0, test_utils_1.fmock)({
            './tmpdir/tings.txt': {
                type: 'file',
                data: chance.string()
            }
        });
    });
    (0, node_test_1.afterEach)(() => {
        (0, test_utils_1.restore)('./tmpdir');
    });
    (0, node_test_1.it)('Positive: Changes directory and file permissions', async () => {
        await index_1.pfs.chmod('./tmpdir', 0o444);
        const writable = index_1.pfs.test('./tmpdir/tings.txt', {
            sync: true,
            flag: 'w'
        });
        (0, node_assert_1.default)(writable === false);
    });
    (0, node_test_1.it)('Negative: Throw if not exists resource', async () => {
        await node_assert_1.default.rejects(async () => {
            await index_1.pfs.chmod('./non-existent-source', 0o744);
        });
    });
    (0, node_test_1.it)('[sync] Positive: Changes permissions of directory', () => {
        index_1.pfs.chmod('./tmpdir', 0o444, {
            sync: true
        });
        const writable = index_1.pfs.test('./tmpdir/tings.txt', {
            sync: true,
            flag: 'w'
        });
        (0, node_assert_1.default)(writable === false);
    });
    (0, node_test_1.it)('[sync] Positive: Changes file permissions', () => {
        index_1.pfs.chmod('./tmpdir/tings.txt', 0o444, {
            sync: true
        });
        const writable = index_1.pfs.test('./tmpdir/tings.txt', {
            sync: true,
            flag: 'w'
        });
        (0, node_assert_1.default)(writable === false);
    });
    (0, node_test_1.it)('[sync] Negative: Throw if not exists resource', () => {
        const guid = chance.guid();
        node_assert_1.default.throws(() => {
            index_1.pfs.chmod(`./${guid}`, 0o744, {
                sync: true
            });
        });
    });
});
