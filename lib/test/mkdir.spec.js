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
describe('mkdir(src [, options])', () => {
    const pfs = new src_1.PoweredFileSystem();
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
    it('Positive: Create directories in the working directory', async () => {
        const guid = chance.guid();
        await pfs.mkdir(`./tmpdir/${guid}`);
        const exist = node_fs_1.default.existsSync(`./tmpdir/${guid}`);
        (0, node_assert_1.default)(exist);
    });
    it(`Positive: Make current directory`, async () => {
        const guid = chance.guid();
        const pfs = new src_1.PoweredFileSystem(`./tmpdir/${guid}`);
        await pfs.mkdir('.');
        const exist = node_fs_1.default.existsSync(`./tmpdir/${guid}`);
        (0, node_assert_1.default)(exist);
    });
    it('Positive: Should work fine with the existing directory', async () => {
        const guid = chance.guid();
        for (let i = 2; i; i--) {
            await pfs.mkdir(`./tmpdir/${guid}`);
        }
        const exist = node_fs_1.default.existsSync(`./tmpdir/${guid}`);
        (0, node_assert_1.default)(exist);
    });
    it('Negative: Throw an exception if trying to create a directory in file', async () => {
        const guid = chance.guid();
        await (0, expect_1.expect)(async () => {
            await pfs.mkdir(`./tmpdir/tings.txt/${guid}`);
        })
            .rejects
            .toThrow();
    });
    it('Positive: Create directories in the working directory', () => {
        const guid = chance.guid();
        pfs.mkdir(`./tmpdir/${guid}`, {
            sync: true
        });
        const exist = node_fs_1.default.existsSync(`./tmpdir/${guid}`);
        (0, node_assert_1.default)(exist);
    });
    it('[sync] Positive: Make current directory', () => {
        const guid = chance.guid();
        const pfs = new src_1.PoweredFileSystem(`./tmpdir/${guid}`);
        pfs.mkdir('.', {
            sync: true
        });
        const exist = node_fs_1.default.existsSync(`./tmpdir/${guid}`);
        (0, node_assert_1.default)(exist);
    });
    it('[sync] Positive: Should work fine with the existing directory', () => {
        const guid = chance.guid();
        for (let i = 2; i; i--) {
            pfs.mkdir(`./tmpdir/${guid}`, {
                sync: true
            });
        }
        const exist = node_fs_1.default.existsSync(`./tmpdir/${guid}`);
        (0, node_assert_1.default)(exist);
    });
    it('[sync] Negative: Throw an exception if trying to create a directory in file', () => {
        const guid = chance.guid();
        node_assert_1.default.throws(() => {
            pfs.mkdir(`./tmpdir/tings.txt/${guid}`, {
                sync: true
            });
        });
    });
});
