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
(0, node_test_1.describe)('readdir(src[, options])', () => {
    const chance = new chance_1.default();
    let counter = 0;
    (0, node_test_1.beforeEach)(() => {
        const frame = {
            './tmpdir/tings.txt': {
                type: 'file',
                data: chance.string()
            }
        };
        counter = chance.natural({ max: 7 });
        for (let i = 0; i < counter; i++) {
            frame[`./tmpdir/${i}`] = { type: 'directory' };
        }
        (0, test_utils_1.fmock)(frame);
    });
    (0, node_test_1.afterEach)(() => {
        (0, test_utils_1.restore)('./tmpdir');
    });
    (0, node_test_1.it)('Positive: Must return a directory listing', async () => {
        const { length } = await index_1.pfs.readdir('./tmpdir');
        (0, node_assert_1.default)(counter + 1 === length);
    });
    (0, node_test_1.it)('Negative: Throw if resource is not directory', async () => {
        await node_assert_1.default.rejects(async () => {
            await index_1.pfs.readdir('./tmpdir/tings.txt');
        });
    });
    (0, node_test_1.it)('Negative: Throw if not exists resource', async () => {
        const guid = chance.guid();
        await node_assert_1.default.rejects(async () => {
            await index_1.pfs.readdir(`./tmpdir/${guid}`);
        });
    });
    (0, node_test_1.it)('[sync] Positive: Must return a directory listing', () => {
        const { length } = index_1.pfs.readdir('./tmpdir', {
            sync: true
        });
        (0, node_assert_1.default)(counter + 1 === length);
    });
    (0, node_test_1.it)('Negative: Throw if resource is not directory', () => {
        node_assert_1.default.throws(() => {
            index_1.pfs.readdir('./tmpdir/tings.txt', {
                sync: true
            });
        });
    });
    (0, node_test_1.it)('Negative: Throw if not exists resource', () => {
        const guid = chance.guid();
        node_assert_1.default.throws(() => {
            index_1.pfs.readdir(`./tmpdir/${guid}`, {
                sync: true
            });
        });
    });
});
