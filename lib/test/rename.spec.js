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
describe('rename(src, use [, options])', () => {
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
    it('Positive: Must be recursive rename file', async () => {
        await src_1.pfs.rename('./tmpdir/tings.txt', './tmpdir/newapp.txt');
        const exist = node_fs_1.default.existsSync(`./tmpdir/newapp.txt`);
        (0, node_assert_1.default)(exist);
    });
    it('Positive: Must be recursive rename directory', async () => {
        await src_1.pfs.rename('./tmpdir/digest', './tmpdir/newxbase');
        const exist = node_fs_1.default.existsSync(`./tmpdir/newxbase`);
        (0, node_assert_1.default)(exist);
    });
    it('Negative: Throw if not exists resource', async () => {
        const guid = chance.guid();
        await (0, expect_1.expect)(async () => {
            await src_1.pfs.rename(`./tmpdir/${guid}`, './tmpdir/newxbase');
        })
            .rejects
            .toThrow();
    });
    it('[sync] Positive: Must be recursive rename file', () => {
        src_1.pfs.rename('./tmpdir/tings.txt', './tmpdir/newapp.txt', {
            sync: true
        });
        const exist = node_fs_1.default.existsSync(`./tmpdir/newapp.txt`);
        (0, node_assert_1.default)(exist);
    });
    it('[sync] Positive: Must be recursive rename directory', () => {
        src_1.pfs.rename('./tmpdir/digest', './tmpdir/newxbase', {
            sync: true
        });
        const exist = node_fs_1.default.existsSync(`./tmpdir/newxbase`);
        (0, node_assert_1.default)(exist);
    });
    it('[sync] Negative: Throw if not exists resource', () => {
        const guid = chance.guid();
        node_assert_1.default.throws(() => {
            src_1.pfs.rename(`./tmpdir/${guid}`, './tmpdir/newxbase', {
                sync: true
            });
        });
    });
});
