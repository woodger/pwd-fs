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
(0, node_test_1.describe)('read(src [, options])', () => {
    const chance = new chance_1.default();
    let sentences = 0;
    let tmpDir = '';
    (0, node_test_1.beforeEach)(() => {
        tmpDir = (0, test_utils_1.createTmpDir)();
        const tingsContent = chance.paragraph();
        sentences = tingsContent.length;
        (0, test_utils_1.fmock)({
            [node_path_1.default.join(tmpDir, 'tings.txt')]: {
                type: 'file',
                data: tingsContent
            }
        });
    });
    (0, node_test_1.afterEach)(() => {
        (0, test_utils_1.restore)(tmpDir);
    });
    (0, node_test_1.it)('Positive: Must read content of file; String type by default', async () => {
        const { length } = await index_1.pfs.read(node_path_1.default.join(tmpDir, 'tings.txt'));
        (0, node_assert_1.default)(length === sentences);
    });
    (0, node_test_1.it)('Positive: Must read Buffer content of file when encoding is null', async () => {
        const buffer = await index_1.pfs.read(node_path_1.default.join(tmpDir, 'tings.txt'), {
            encoding: null
        });
        (0, node_assert_1.default)(buffer instanceof Buffer);
    });
    (0, node_test_1.it)('Negative: Throw if resource is not file', async () => {
        await node_assert_1.default.rejects(async () => {
            await index_1.pfs.read(tmpDir);
        });
    });
    (0, node_test_1.it)('Negative: Throw if not exists resource', async () => {
        const guid = chance.guid();
        await node_assert_1.default.rejects(async () => {
            await index_1.pfs.read(node_path_1.default.join(tmpDir, guid));
        });
    });
    (0, node_test_1.it)('[sync] Positive: Must read content of file; String type by default', () => {
        const { length } = index_1.pfs.read(node_path_1.default.join(tmpDir, 'tings.txt'), {
            sync: true
        });
        (0, node_assert_1.default)(length === sentences);
    });
    (0, node_test_1.it)('[sync] Positive: Must read Buffer content of file when encoding is null', () => {
        const buf = index_1.pfs.read(node_path_1.default.join(tmpDir, 'tings.txt'), {
            sync: true,
            encoding: null
        });
        (0, node_assert_1.default)(buf instanceof Buffer);
    });
    (0, node_test_1.it)('[sync] Negative: Throw if not exists resource', () => {
        const guid = chance.guid();
        node_assert_1.default.throws(() => {
            index_1.pfs.read(node_path_1.default.join(tmpDir, guid), {
                sync: true
            });
        });
    });
});
