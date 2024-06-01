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
describe('chmod(src, mode [, options])', () => {
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
    it('Positive: Changes directory and file permissions', async () => {
        await src_1.pfs.chmod('./tmpdir', 0o744);
        const { mode } = node_fs_1.default.lstatSync('./tmpdir/tings.txt');
        const umask = (0, src_1.bitmask)(mode);
        (0, node_assert_1.default)(umask === 0o744);
    });
    it('Negative: Throw if not exists resource', async () => {
        await (0, expect_1.expect)(async () => {
            await src_1.pfs.chmod('./non-existent-source', 0o744);
        })
            .rejects
            .toThrow();
    });
    it(`[sync] Positive: Changes permissions of directory`, () => {
        src_1.pfs.chmod('./tmpdir', 0o744, {
            sync: true
        });
        const { mode } = node_fs_1.default.lstatSync('./tmpdir');
        const umask = (0, src_1.bitmask)(mode);
        (0, node_assert_1.default)(umask === 0o744);
    });
    it(`[sync] Positive: Changes file permissions`, () => {
        src_1.pfs.chmod('./tmpdir', 0o744, {
            sync: true
        });
        const { mode } = node_fs_1.default.lstatSync('./tmpdir/tings.txt');
        const umask = (0, src_1.bitmask)(mode);
        (0, node_assert_1.default)(umask === 0o744);
    });
    it('[sync] Negative: Throw if not exists resource', () => {
        const guid = chance.guid();
        node_assert_1.default.throws(() => {
            src_1.pfs.chmod(`./${guid}`, 0o744, {
                sync: true
            });
        });
    });
});
