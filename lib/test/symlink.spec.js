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
describe('symlink(src, use [, options])', () => {
    const chance = new chance_1.default();
    beforeEach(() => {
        const cwd = process.cwd();
        const frame = {
            './tmpdir/tings.txt': {
                type: 'file',
                data: chance.string()
            },
            './tmpdir/digest/': { type: 'directory' },
            './tmpdir/flexapp': {
                type: 'symlink',
                target: `${cwd}/tmpdir/tings.txt`
            }
        };
        const counter = chance.natural({ max: 7 });
        for (let i = 0; i < counter; i++) {
            frame[`./tmpdir/${i}`] = { type: 'directory' };
        }
        (0, __fmock_1.fmock)(frame);
    });
    afterEach(() => {
        (0, __fmock_1.restore)('./tmpdir');
    });
    it('Positive: Must be created a symbolic link', async () => {
        await src_1.pfs.symlink('./tmpdir/tings.txt', './tmpdir/linkapp');
        const stat = node_fs_1.default.lstatSync('./tmpdir/linkapp');
        (0, node_assert_1.default)(stat.isSymbolicLink());
    });
    it('Positive: Must be created a symbolic link for directory', async () => {
        await src_1.pfs.symlink('./tmpdir/digest', './tmpdir/linkapp');
        const stat = node_fs_1.default.lstatSync('./tmpdir/linkapp');
        (0, node_assert_1.default)(stat.isSymbolicLink());
    });
    it('Negative: Throw if destination already exists', async () => {
        await (0, expect_1.expect)(async () => {
            await src_1.pfs.symlink('./tmpdir/tings.txt', './tmpdir/flexapp');
        })
            .rejects
            .toThrow();
    });
    it('[sync] Positive: Must be created a symbolic link', () => {
        src_1.pfs.symlink('./tmpdir/tings.txt', './tmpdir/linkapp', {
            sync: true
        });
        const stat = node_fs_1.default.lstatSync('./tmpdir/linkapp');
        (0, node_assert_1.default)(stat.isSymbolicLink());
    });
    it('[sync] Positive: Must be created a symbolic link for directory', () => {
        src_1.pfs.symlink('./tmpdir/digest', './tmpdir/linkapp', {
            sync: true
        });
        const stat = node_fs_1.default.lstatSync('./tmpdir/linkapp');
        (0, node_assert_1.default)(stat.isSymbolicLink());
    });
    it('[sync] Negative: Throw if destination already exists', () => {
        node_assert_1.default.throws(() => {
            src_1.pfs.symlink('./tmpdir/tings.txt', './tmpdir/flexapp', {
                sync: true
            });
        });
    });
});
