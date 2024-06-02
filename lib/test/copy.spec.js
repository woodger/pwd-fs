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
describe('copy(src, dir [, options])', () => {
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
    it('Positive: Copying a item file', async () => {
        await src_1.pfs.copy('./tmpdir/tings.txt', './tmpdir/digest');
        const exist = node_fs_1.default.existsSync(`./tmpdir/digest/tings.txt`);
        (0, node_assert_1.default)(exist);
    });
    it('Positive: Recursive copying a directory', async () => {
        await src_1.pfs.copy('./src', './tmpdir');
        const exist = node_fs_1.default.existsSync(`./tmpdir/src`);
        (0, node_assert_1.default)(exist);
    });
    it('Negative: Throw if not exists resource', async () => {
        const guid = chance.guid();
        await (0, expect_1.expect)(async () => {
            await src_1.pfs.copy(`./${guid}`, '.');
        })
            .rejects
            .toThrow();
    });
    it('Negative: An attempt to copy to an existing resource should return an Error', async () => {
        await (0, expect_1.expect)(async () => {
            await src_1.pfs.copy('./tmpdir', '.');
        })
            .rejects
            .toThrow();
    });
    it('[sync] Positive: Copying a file', () => {
        src_1.pfs.copy('./tmpdir/tings.txt', './tmpdir/digest', {
            sync: true
        });
        const exist = node_fs_1.default.existsSync(`./tmpdir/digest/tings.txt`);
        (0, node_assert_1.default)(exist);
    });
    it('[sync] Positive: Recursive copying a directory', () => {
        src_1.pfs.copy('./src', './tmpdir', {
            sync: true
        });
        const exist = node_fs_1.default.existsSync(`./tmpdir/src`);
        (0, node_assert_1.default)(exist);
    });
    it('[sync] Negative: Throw if not exists resource', () => {
        const guid = chance.guid();
        node_assert_1.default.throws(() => {
            src_1.pfs.copy(`./${guid}`, '.', {
                sync: true
            });
        });
    });
    it('[sync] Negative: An attempt to copy to an existing resource should return an Error', () => {
        node_assert_1.default.throws(() => {
            src_1.pfs.copy('./tmpdir', '.', {
                sync: true
            });
        });
    });
});
