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
describe('stat(src [, options])', () => {
    const chance = new chance_1.default();
    beforeEach(() => {
        const cwd = process.cwd();
        (0, __fmock_1.fmock)({
            './tmpdir/tings.txt': {
                type: 'file',
                data: chance.string()
            },
            './tmpdir/digest/': { type: 'directory' },
            './tmpdir/flexapp': {
                type: 'symlink',
                target: `${cwd}/tmpdir/tings.txt`
            }
        });
    });
    afterEach(() => {
        (0, __fmock_1.restore)('./tmpdir');
    });
    it('Positive: Must return information a file', async () => {
        const stats = await src_1.pfs.stat('./tmpdir/tings.txt');
        (0, node_assert_1.default)(stats.isFile());
    });
    it('Positive: Must return information a directory', async () => {
        const stats = await src_1.pfs.stat('./tmpdir/digest');
        (0, node_assert_1.default)(stats.isDirectory());
    });
    it('Positive: Must return information a symlink', async () => {
        const stats = await src_1.pfs.stat('./tmpdir/flexapp');
        (0, node_assert_1.default)(stats.isSymbolicLink());
    });
    it('Negative: Throw if not exists resource', async () => {
        const guid = chance.guid();
        await (0, expect_1.expect)(async () => {
            await src_1.pfs.stat(`./tmpdir/${guid}`);
        })
            .rejects
            .toThrow();
    });
    it('[sync] Positive: Must return information a file', () => {
        const stats = src_1.pfs.stat('./tmpdir/tings.txt', {
            sync: true
        });
        (0, node_assert_1.default)(stats.isFile());
    });
    it('[sync] Positive: Must return information a directory in ', () => {
        const stats = src_1.pfs.stat('./tmpdir/digest', {
            sync: true
        });
        (0, node_assert_1.default)(stats.isDirectory());
    });
    it('[sync] Positive: Must return information a symlink', () => {
        const stats = src_1.pfs.stat('./tmpdir/flexapp', {
            sync: true
        });
        (0, node_assert_1.default)(stats.isSymbolicLink());
    });
    it('[sync] Negative: Throw if not exists resource', () => {
        const guid = chance.guid();
        node_assert_1.default.throws(() => {
            src_1.pfs.stat(`./tmpdir/${guid}`, {
                sync: true
            });
        });
    });
});
