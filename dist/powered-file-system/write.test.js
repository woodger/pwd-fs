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
const itUnix = process.platform === 'win32' ? node_test_1.it.skip : node_test_1.it;
(0, node_test_1.describe)('write(src, data[, options])', { concurrency: false }, () => {
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
    (0, node_test_1.it)('Positive: Must write content to file', async () => {
        const payload = chance.paragraph();
        const guid = chance.guid();
        await index_1.pfs.write(`./tmpdir/${guid}.txt`, payload);
        const { size } = node_fs_1.default.lstatSync(`./tmpdir/${guid}.txt`);
        (0, node_assert_1.default)(payload.length === size);
    });
    (0, node_test_1.it)('Positive: Must rewrite content if file already exists', async () => {
        const payload = chance.paragraph();
        await index_1.pfs.write('./tmpdir/tings.txt', payload);
        const { size } = node_fs_1.default.lstatSync('./tmpdir/tings.txt');
        (0, node_assert_1.default)(payload.length === size);
    });
    (0, node_test_1.it)('Negative: Throw if resource is directory', async () => {
        const payload = chance.paragraph();
        await node_assert_1.default.rejects(async () => {
            await index_1.pfs.write('./tmpdir', payload);
        });
    });
    (0, node_test_1.it)(`Negative: Unexpected option 'flag' returns Error`, async () => {
        const payload = chance.paragraph();
        await node_assert_1.default.rejects(async () => {
            await index_1.pfs.write('./tmpdir/tings.txt', payload, {
                flag: 'r'
            });
        });
    });
    (0, node_test_1.it)('[sync] Positive: Write contents even to a non-existent file', () => {
        const payload = chance.paragraph();
        const guid = chance.guid();
        index_1.pfs.write(`./tmpdir/${guid}.txt`, payload, {
            sync: true
        });
        const content = node_fs_1.default.readFileSync(`./tmpdir/${guid}.txt`, 'utf8');
        (0, node_assert_1.default)(payload === content);
    });
    (0, node_test_1.it)('[sync] Negative: Throw if resource is directory', () => {
        const payload = chance.paragraph();
        node_assert_1.default.throws(() => {
            index_1.pfs.write('./tmpdir', payload, {
                sync: true
            });
        });
    });
    (0, node_test_1.it)(`[sync] Negative: Unexpected option 'flag' returns Error`, () => {
        const payload = chance.paragraph();
        node_assert_1.default.throws(() => {
            index_1.pfs.write('./tmpdir/tings.txt', payload, {
                sync: true,
                flag: 'r'
            });
        });
    });
    itUnix('[sync] Positive: Umask should be applied with bit masking', () => {
        const guid = chance.guid();
        index_1.pfs.write(`./tmpdir/${guid}.txt`, 'x', {
            sync: true,
            umask: 0o111
        });
        const mode = node_fs_1.default.statSync(`./tmpdir/${guid}.txt`).mode & 0o777;
        (0, node_assert_1.default)(mode === 0o666);
    });
});
