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
describe('rename(src, use [, options])', () => {
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
    it('Positive: Must be recursive rename file', async () => {
        const pfs = new src_1.default();
        await pfs.rename('./tmpdir/binapp', './tmpdir/newapp');
        const exist = await pfs.test('./tmpdir/newapp');
        (0, assert_1.default)(exist);
    });
    it('Positive: Must be recursive rename directory', async () => {
        const pfs = new src_1.default();
        await pfs.rename('./tmpdir/libxbase', './tmpdir/newxbase');
        const exist = await pfs.test('./tmpdir/newxbase');
        (0, assert_1.default)(exist);
    });
    it('Positive: Must be recursive rename directory, when path is absolute', async () => {
        const pfs = new src_1.default();
        const cwd = process.cwd();
        await pfs.rename(`${cwd}${path_1.sep}tmpdir`, `${cwd}${path_1.sep}newxbase`, {
            resolve: false
        });
        const exist = await pfs.test('./newxbase');
        (0, assert_1.default)(exist);
    });
    it('Negative: Throw if not exists resource', async () => {
        const pfs = new src_1.default();
        const chance = new chance_1.default();
        const base = chance.guid();
        try {
            await pfs.rename(`./${base}`, './tmpdir/newapp');
        }
        catch (err) {
            (0, assert_1.default)(err.errno === -2);
        }
    });
    describe('sync mode', () => {
        it('Positive: Must be recursive rename file', async () => {
            const pfs = new src_1.default();
            pfs.rename('./tmpdir/binapp', './tmpdir/newapp', {
                sync: true
            });
            const exist = await pfs.test('./tmpdir/newapp');
            (0, assert_1.default)(exist);
        });
        it('Positive: Must be recursive rename directory', async () => {
            const pfs = new src_1.default();
            pfs.rename('./tmpdir/libxbase', './tmpdir/newxbase', {
                sync: true
            });
            const exist = await pfs.test('./tmpdir/newxbase');
            (0, assert_1.default)(exist);
        });
        it('Positive: Must be recursive rename directory, when path is absolute', async () => {
            const pfs = new src_1.default();
            const cwd = process.cwd();
            pfs.rename(`${cwd}${path_1.sep}tmpdir`, `${cwd}${path_1.sep}newxbase`, {
                sync: true,
                resolve: false
            });
            const exist = await pfs.test('./newxbase');
            (0, assert_1.default)(exist);
        });
        it('Negative: Throw if not exists resource', async () => {
            const pfs = new src_1.default();
            const chance = new chance_1.default();
            const base = chance.guid();
            try {
                pfs.rename(`./${base}`, './tmpdir/newapp', {
                    sync: true
                });
            }
            catch (err) {
                (0, assert_1.default)(err.errno === -2);
            }
        });
    });
});
