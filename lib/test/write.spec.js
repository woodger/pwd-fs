"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_fs_1 = __importDefault(require("node:fs"));
const chance_1 = __importDefault(require("chance"));
const expect_1 = require("expect");
const __fmock_1 = require("./__fmock");
const src_1 = require("../src");
describe('write(src, data[, options])', () => {
    const chance = new chance_1.default();
    beforeEach(() => {
        (0, __fmock_1.fmock)({
            './tmpdir/tings.txt': {
                type: 'file',
                data: chance.string()
            }
        });
    });
    afterEach(() => {
        (0, __fmock_1.restore)('./tmpdir');
    });
    it('Positive: Must write content to file', async () => {
        const payload = chance.paragraph();
        const guid = chance.guid();
        await src_1.pfs.write(`./tmpdir/${guid}.txt`, payload);
        const { size } = node_fs_1.default.lstatSync(`./tmpdir/${guid}.txt`);
        (0, node_assert_1.default)(payload.length === size);
    });
    it('Positive: Must rewrite content if file already exists', async () => {
        const payload = chance.paragraph();
        await src_1.pfs.write('./tmpdir/tings.txt', payload);
        const { size } = node_fs_1.default.lstatSync('./tmpdir/tings.txt');
        (0, node_assert_1.default)(payload.length === size);
    });
    it('Negative: Throw if resource is directory', async () => {
        const payload = chance.paragraph();
        await (0, expect_1.expect)(async () => {
            await src_1.pfs.write('./tmpdir', payload);
        })
            .rejects
            .toThrow();
    });
    it(`Negative: Unexpected option 'flag' returns Error`, async () => {
        const payload = chance.paragraph();
        await (0, expect_1.expect)(async () => {
            await src_1.pfs.write('./tmpdir/tings.txt', payload, {
                flag: 'r'
            });
        })
            .rejects
            .toThrow();
    });
    it('[sync] Positive: Write contents even to a non-existent file', () => {
        const payload = chance.paragraph();
        const guid = chance.guid();
        src_1.pfs.write(`./tmpdir/${guid}.txt`, payload, {
            sync: true
        });
        const content = node_fs_1.default.readFileSync(`./tmpdir/${guid}.txt`, 'utf8');
        (0, node_assert_1.default)(payload === content);
    });
    it('[sync] Negative: Throw if resource is directory', () => {
        const payload = chance.paragraph();
        node_assert_1.default.throws(() => {
            src_1.pfs.write('./tmpdir', payload, {
                sync: true
            });
        });
    });
    it(`[sync] Negative: Unexpected option 'flag' returns Error`, () => {
        const payload = chance.paragraph();
        node_assert_1.default.throws(() => {
            src_1.pfs.write('./tmpdir/tings.txt', payload, {
                sync: true,
                flag: 'r'
            });
        });
    });
});
