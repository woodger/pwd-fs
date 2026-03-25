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
 * Verifies directory listing behavior and invalid-target failures.
 */
(0, node_test_1.describe)('readdir(src[, options])', () => {
    const chance = new chance_1.default();
    let counter = 0;
    let tmpDir = '';
    (0, node_test_1.beforeEach)(() => {
        tmpDir = (0, test_utils_1.createTmpDir)();
        const frame = {
            [node_path_1.default.join(tmpDir, 'tings.txt')]: {
                type: 'file',
                data: chance.string()
            }
        };
        counter = chance.natural({ max: 7 });
        for (let i = 0; i < counter; i++) {
            frame[node_path_1.default.join(tmpDir, String(i))] = { type: 'directory' };
        }
        (0, test_utils_1.fmock)(frame);
    });
    (0, node_test_1.afterEach)(() => {
        (0, test_utils_1.restore)(tmpDir);
    });
    (0, node_test_1.it)('Positive: Must return a directory listing', async () => {
        const { length } = await index_1.pfs.readdir(tmpDir);
        (0, node_assert_1.default)(counter + 1 === length);
    });
    (0, node_test_1.it)('Negative: Throw if resource is not directory', async () => {
        await node_assert_1.default.rejects(async () => {
            await index_1.pfs.readdir(node_path_1.default.join(tmpDir, 'tings.txt'));
        });
    });
    (0, node_test_1.it)('Negative: Throw if not exists resource', async () => {
        const guid = chance.guid();
        await node_assert_1.default.rejects(async () => {
            await index_1.pfs.readdir(node_path_1.default.join(tmpDir, guid));
        });
    });
    (0, node_test_1.it)('[sync] Positive: Must return a directory listing', () => {
        const { length } = index_1.pfs.readdir(tmpDir, {
            sync: true
        });
        (0, node_assert_1.default)(counter + 1 === length);
    });
    (0, node_test_1.it)('Negative: Throw if resource is not directory', () => {
        node_assert_1.default.throws(() => {
            index_1.pfs.readdir(node_path_1.default.join(tmpDir, 'tings.txt'), {
                sync: true
            });
        });
    });
    (0, node_test_1.it)('Negative: Throw if not exists resource', () => {
        const guid = chance.guid();
        node_assert_1.default.throws(() => {
            index_1.pfs.readdir(node_path_1.default.join(tmpDir, guid), {
                sync: true
            });
        });
    });
});
