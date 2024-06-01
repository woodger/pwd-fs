"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const chance_1 = __importDefault(require("chance"));
const expect_1 = require("expect");
const __fmock_1 = require("./__fmock");
const src_1 = require("../src");
describe('read(src [, options])', () => {
    const chance = new chance_1.default();
    let sentences = 0;
    beforeEach(() => {
        const tingsContent = chance.paragraph();
        sentences = tingsContent.length;
        (0, __fmock_1.fmock)({
            './tmpdir/tings.txt': {
                type: 'file',
                data: tingsContent
            }
        });
    });
    afterEach(() => {
        (0, __fmock_1.restore)('./tmpdir');
    });
    it('Positive: Must read content of file; String type by default', async () => {
        const { length } = await src_1.pfs.read('./tmpdir/tings.txt');
        (0, node_assert_1.default)(length === sentences);
    });
    it('Positive: Must read Buffer content of file when encoding is null', async () => {
        const buffer = await src_1.pfs.read('./tmpdir/tings.txt', {
            encoding: null
        });
        (0, node_assert_1.default)(buffer instanceof Buffer);
    });
    it('Negative: Throw if resource is not file', async () => {
        await (0, expect_1.expect)(async () => {
            await src_1.pfs.read(`./tmpdir`);
        })
            .rejects
            .toThrow();
    });
    it('Negative: Throw if not exists resource', async () => {
        const guid = chance.guid();
        await (0, expect_1.expect)(async () => {
            await src_1.pfs.read(`./tmpdir/${guid}`);
        })
            .rejects
            .toThrow();
    });
    it('[sync] Positive: Must read content of file; String type by default', () => {
        const { length } = src_1.pfs.read('./tmpdir/tings.txt', {
            sync: true
        });
        (0, node_assert_1.default)(length === sentences);
    });
    it('[sync] Positive: Must read Buffer content of file when encoding is null', () => {
        const buffer = src_1.pfs.read('./tmpdir/tings.txt', {
            encoding: null,
            sync: true
        });
        (0, node_assert_1.default)(buffer instanceof Buffer);
    });
    it(`[sync] Negative: Throw if not exists resource`, () => {
        const guid = chance.guid();
        node_assert_1.default.throws(() => {
            src_1.pfs.read(`./tmpdir/${guid}`, {
                sync: true
            });
        });
    });
});
