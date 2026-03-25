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
 * Covers file writes, overwrite behavior, and explicit mode handling.
 */
const itUnix = process.platform === 'win32' ? node_test_1.it.skip : node_test_1.it;
(0, node_test_1.describe)('write(src, data[, options])', () => {
    const chance = new chance_1.default();
    let tmpDir = '';
    (0, node_test_1.beforeEach)(() => {
        tmpDir = (0, test_utils_1.createTmpDir)();
        (0, test_utils_1.fmock)({
            [node_path_1.default.join(tmpDir, 'tings.txt')]: {
                type: 'file',
                data: chance.string()
            }
        });
    });
    (0, node_test_1.afterEach)(() => {
        (0, test_utils_1.restore)(tmpDir);
    });
    (0, node_test_1.it)('Positive: Must write content to file', async () => {
        const payload = chance.paragraph();
        const guid = chance.guid();
        const filePath = node_path_1.default.join(tmpDir, `${guid}.txt`);
        await index_1.pfs.write(filePath, payload);
        const { size } = node_fs_1.default.lstatSync(filePath);
        (0, node_assert_1.default)(payload.length === size);
    });
    (0, node_test_1.it)('Positive: Must rewrite content if file already exists', async () => {
        const payload = chance.paragraph();
        await index_1.pfs.write(node_path_1.default.join(tmpDir, 'tings.txt'), payload);
        const { size } = node_fs_1.default.lstatSync(node_path_1.default.join(tmpDir, 'tings.txt'));
        (0, node_assert_1.default)(payload.length === size);
    });
    (0, node_test_1.it)('Negative: Throw if resource is directory', async () => {
        const payload = chance.paragraph();
        await node_assert_1.default.rejects(async () => {
            await index_1.pfs.write(tmpDir, payload);
        });
    });
    (0, node_test_1.it)(`Negative: Unexpected option 'flag' returns Error`, async () => {
        const payload = chance.paragraph();
        await node_assert_1.default.rejects(async () => {
            await index_1.pfs.write(node_path_1.default.join(tmpDir, 'tings.txt'), payload, {
                flag: 'r'
            });
        });
    });
    (0, node_test_1.it)('[sync] Positive: Write contents even to a non-existent file', () => {
        const payload = chance.paragraph();
        const guid = chance.guid();
        const filePath = node_path_1.default.join(tmpDir, `${guid}.txt`);
        index_1.pfs.write(filePath, payload, {
            sync: true
        });
        const content = node_fs_1.default.readFileSync(filePath, 'utf8');
        (0, node_assert_1.default)(payload === content);
    });
    (0, node_test_1.it)('[sync] Negative: Throw if resource is directory', () => {
        const payload = chance.paragraph();
        node_assert_1.default.throws(() => {
            index_1.pfs.write(tmpDir, payload, {
                sync: true
            });
        });
    });
    (0, node_test_1.it)(`[sync] Negative: Unexpected option 'flag' returns Error`, () => {
        const payload = chance.paragraph();
        node_assert_1.default.throws(() => {
            index_1.pfs.write(node_path_1.default.join(tmpDir, 'tings.txt'), payload, {
                sync: true,
                flag: 'r'
            });
        });
    });
    itUnix('[sync] Positive: Umask should be applied with bit masking', () => {
        const guid = chance.guid();
        const filePath = node_path_1.default.join(tmpDir, `${guid}.txt`);
        index_1.pfs.write(filePath, 'x', {
            sync: true,
            umask: 0o111
        });
        const mode = node_fs_1.default.statSync(filePath).mode & 0o777;
        (0, node_assert_1.default)(mode === 0o666);
    });
});
