"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const chance_1 = __importDefault(require("chance"));
const __fmock_1 = require("./__fmock");
const src_1 = require("../src");
describe('test(src[, options])', () => {
    const chance = new chance_1.default();
    beforeEach(() => {
        (0, __fmock_1.fmock)({
            './tmpdir/tings.txt': {
                type: 'file',
                data: chance.string()
            },
            './tmpdir/digest/': { type: 'directory' }
        });
    });
    afterEach(() => {
        (0, __fmock_1.restore)('./tmpdir');
    });
    it(`Positive: Should return 'true' for current working directory`, async () => {
        const exist = await src_1.pfs.test('.');
        (0, node_assert_1.default)(exist);
    });
    it(`Positive: For existing file should return 'true'`, async () => {
        const exist = await src_1.pfs.test('./tmpdir/tings.txt');
        (0, node_assert_1.default)(exist);
    });
    it(`Positive: For existing directory should return 'true'`, async () => {
        const exist = await src_1.pfs.test('./tmpdir/digest');
        (0, node_assert_1.default)(exist);
    });
    it(`Positive: A non-existent file must return 'false'`, async () => {
        const guid = chance.guid();
        const exist = await src_1.pfs.test(`./tmpdir/${guid}`);
        (0, node_assert_1.default)(exist === false);
    });
    it(`Positive: For existing file should return 'true'`, () => {
        const exist = src_1.pfs.test('./tmpdir/tings.txt', {
            sync: true
        });
        (0, node_assert_1.default)(exist);
    });
    it(`[sync] Positive: For existing directory should return 'true'`, () => {
        const exist = src_1.pfs.test('./tmpdir/digest', {
            sync: true
        });
        (0, node_assert_1.default)(exist);
    });
    it(`[sync] Positive: A non-existent file must return 'false'`, () => {
        const guid = chance.guid();
        const exist = src_1.pfs.test(`./tmpdir/${guid}`, {
            sync: true
        });
        (0, node_assert_1.default)(exist === false);
    });
});
