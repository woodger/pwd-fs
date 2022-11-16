"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const path_1 = require("path");
const mock_fs_1 = __importDefault(require("mock-fs"));
const chance_1 = __importDefault(require("chance"));
const src_1 = __importDefault(require("../src"));
describe('symlink(src, use [, options])', () => {
    beforeEach(() => {
        const chance = new chance_1.default();
        (0, mock_fs_1.default)({
            'tmpdir': {
                'binapp': chance.string(),
                'libxbase': mock_fs_1.default.directory()
            },
            'flexapp': mock_fs_1.default.symlink({
                path: 'tmpdir/binapp'
            })
        });
    });
    afterEach(mock_fs_1.default.restore);
    it('Positive: Must be created a symbolic link', async () => {
        const pfs = new src_1.default();
        await pfs.symlink('./tmpdir/binapp', './linkapp');
        const stats = await pfs.stat('./linkapp');
        (0, assert_1.default)(stats.isSymbolicLink());
    });
    it('Positive: Must be created a symbolic link for directory', async () => {
        const pfs = new src_1.default();
        await pfs.symlink(`./tmpdir/libxbase`, './linkapp');
        const stats = await pfs.stat('./linkapp');
        (0, assert_1.default)(stats.isSymbolicLink());
    });
    it('Positive: Must be created a symbolic, when path is absolute', async () => {
        const pfs = new src_1.default();
        const cwd = process.cwd();
        await pfs.symlink(`${cwd}${path_1.sep}tmpdir${path_1.sep}libxbase`, `${cwd}${path_1.sep}linkapp`, {
            resolve: false
        });
        const stats = await pfs.stat('./linkapp');
        (0, assert_1.default)(stats.isSymbolicLink());
    });
    it('Negative: Throw if destination already exists', async () => {
        const pfs = new src_1.default();
        try {
            await pfs.symlink(`./flexapp`, './tmpdir/binapp');
        }
        catch (err) {
            (0, assert_1.default)(err.errno === -17);
        }
    });
    it('Negative: Throw if not exists resource', async () => {
        const pfs = new src_1.default();
        const chance = new chance_1.default();
        const base = chance.guid();
        try {
            await pfs.symlink(`./${base}`, './linkapp');
        }
        catch (err) {
            (0, assert_1.default)(err.errno === -2);
        }
    });
    describe('sync mode', () => {
        it('Positive: Must be created a symbolic link', async () => {
            const pfs = new src_1.default();
            pfs.symlink('./tmpdir/binapp', './linkapp', {
                sync: true
            });
            const stats = await pfs.stat('./linkapp');
            (0, assert_1.default)(stats.isSymbolicLink());
        });
        it('Positive: Must be created a symbolic link for directory', async () => {
            const pfs = new src_1.default();
            pfs.symlink(`./tmpdir/libxbase`, './linkapp', {
                sync: true
            });
            const stats = await pfs.stat('./linkapp');
            (0, assert_1.default)(stats.isSymbolicLink());
        });
        it('Positive: Must be created a symbolic, when path is absolute', async () => {
            const pfs = new src_1.default();
            const cwd = process.cwd();
            pfs.symlink(`${cwd}${path_1.sep}tmpdir${path_1.sep}libxbase`, `${cwd}${path_1.sep}linkapp`, {
                sync: true,
                resolve: false
            });
            const stats = await pfs.stat('./linkapp');
            (0, assert_1.default)(stats.isSymbolicLink());
        });
        it('Negative: Throw if destination already exists', async () => {
            const pfs = new src_1.default();
            try {
                pfs.symlink(`./flexapp`, './tmpdir/binapp', {
                    sync: true
                });
            }
            catch (err) {
                (0, assert_1.default)(err.errno === -17);
            }
        });
        it('Negative: Throw if not exists resource', async () => {
            const pfs = new src_1.default();
            const chance = new chance_1.default();
            const base = chance.guid();
            try {
                pfs.symlink(`./${base}`, './linkapp', {
                    sync: true
                });
            }
            catch (err) {
                (0, assert_1.default)(err.errno === -2);
            }
        });
    });
});
