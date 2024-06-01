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
describe('chown(src, uid, gid [, options])', () => {
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
    it('Positive: Changes the permissions of a file', async () => {
        const { uid, gid } = node_fs_1.default.statSync('./tmpdir/tings.txt');
        await src_1.pfs.chown('./tmpdir/tings.txt', uid, gid);
        (0, node_assert_1.default)(uid && gid);
    });
    it('Positive: Changes the permissions of a directory', async () => {
        const { uid, gid } = node_fs_1.default.statSync('./tmpdir/digest');
        await src_1.pfs.chown('./tmpdir/digest', uid, gid);
        (0, node_assert_1.default)(uid && gid);
    });
    it('Negative: To a non-existent resource to return an Error', async () => {
        const guid = chance.guid();
        const { uid, gid } = node_fs_1.default.statSync('./tmpdir/tings.txt');
        await (0, expect_1.expect)(async () => {
            await src_1.pfs.chown(`./tmpdir/${guid}`, uid, gid);
        })
            .rejects
            .toThrow();
    });
    it('[sync] Positive: Changes the permissions of a file', () => {
        const { uid, gid } = node_fs_1.default.statSync('./tmpdir/tings.txt');
        src_1.pfs.chown('./tmpdir/tings.txt', uid, gid, {
            sync: true
        });
        (0, node_assert_1.default)(uid && gid);
    });
    it('[sync] Positive: Changes the permissions of a directory', () => {
        const { uid, gid } = node_fs_1.default.statSync('./tmpdir/digest');
        src_1.pfs.chown('./tmpdir/digest', uid, gid, {
            sync: true
        });
        (0, node_assert_1.default)(uid && gid);
    });
    it('[sync] Negative: To a non-existent resource to return an Error', () => {
        const guid = chance.guid();
        const { uid, gid } = node_fs_1.default.statSync('./tmpdir/tings.txt');
        node_assert_1.default.throws(() => {
            src_1.pfs.chown(`./tmpdir/${guid}`, uid, gid, {
                sync: true
            });
        });
    });
});
