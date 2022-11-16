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
describe('readdir(src[, options])', () => {
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
    it('Positive: Must return a directory listing', async () => {
        const pfs = new src_1.default();
        const listOfFiles = await pfs.readdir('./tmpdir');
        assert_1.default.deepStrictEqual(listOfFiles, [
            'binapp',
            'libxbase'
        ]);
    });
    it('Positive: Must return a directory listing, when path is absolute', async () => {
        const pfs = new src_1.default();
        const cwd = process.cwd();
        const listOfFiles = await pfs.readdir(`${cwd}${path_1.sep}tmpdir`, {
            resolve: false
        });
        assert_1.default.deepStrictEqual(listOfFiles, [
            'binapp',
            'libxbase'
        ]);
    });
    it('Negative: Throw if resource is not directory', async () => {
        const pfs = new src_1.default();
        try {
            await pfs.readdir(`./tmpdir/binapp`);
        }
        catch (err) {
            (0, assert_1.default)(err.errno === -20);
        }
    });
    it('Negative: Throw if not exists resource', async () => {
        const pfs = new src_1.default();
        const chance = new chance_1.default();
        const base = chance.guid();
        try {
            await pfs.readdir(`./${base}`);
        }
        catch (err) {
            (0, assert_1.default)(err.errno === -2);
        }
    });
    describe('sync mode', () => {
        it('Positive: Must return a directory listing', async () => {
            const pfs = new src_1.default();
            const listOfFiles = pfs.readdir('./tmpdir', {
                sync: true
            });
            assert_1.default.deepStrictEqual(listOfFiles, [
                'binapp',
                'libxbase'
            ]);
        });
        it('Positive: Must return a directory listing, when path is absolute', async () => {
            const pfs = new src_1.default();
            const cwd = process.cwd();
            const listOfFiles = pfs.readdir(`${cwd}${path_1.sep}tmpdir`, {
                sync: true,
                resolve: false
            });
            assert_1.default.deepStrictEqual(listOfFiles, [
                'binapp',
                'libxbase'
            ]);
        });
        it('Negative: Throw if resource is not directory', async () => {
            const pfs = new src_1.default();
            try {
                pfs.readdir(`./tmpdir/binapp`, {
                    sync: true
                });
            }
            catch (err) {
                (0, assert_1.default)(err.errno === -20);
            }
        });
        it(`Negative: Throw if not exists resource`, async () => {
            const pfs = new src_1.default();
            const chance = new chance_1.default();
            const base = chance.guid();
            try {
                pfs.readdir(`./${base}`, {
                    sync: true
                });
            }
            catch (err) {
                (0, assert_1.default)(err.errno === -2);
            }
        });
    });
});
