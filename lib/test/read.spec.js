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
describe('read(src [, options])', () => {
    beforeEach(() => {
        const chance = new chance_1.default();
        mock_fs_1.default({
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
    it('Positive: Must read content of file; String type by default', async () => {
        const pfs = new src_1.default();
        const raw = await pfs.read('./tmpdir/binapp');
        assert_1.default(raw.length > 0);
    });
    it('Positive: Must read Buffer content of file when encoding is null', async () => {
        const pfs = new src_1.default();
        const raw = await pfs.read('./tmpdir/binapp', {
            encoding: null
        });
        assert_1.default(raw instanceof Buffer);
    });
    it('Positive: Must read content of file, when path is absolute', async () => {
        const pfs = new src_1.default();
        const cwd = process.cwd();
        const raw = await pfs.read(`${cwd}${path_1.sep}tmpdir${path_1.sep}binapp`, {
            resolve: false
        });
        assert_1.default(raw.length > 0);
    });
    it('Negative: Throw if resource is not file', async () => {
        const pfs = new src_1.default();
        try {
            await pfs.read(`./tmpdir/libxbase`);
        }
        catch (err) {
            assert_1.default(err.errno === -21);
        }
    });
    it('Negative: Throw if not exists resource', async () => {
        const pfs = new src_1.default();
        const chance = new chance_1.default();
        const base = chance.guid();
        try {
            await pfs.read(`./${base}`);
        }
        catch (err) {
            assert_1.default(err.errno === -2);
        }
    });
    describe('sync mode', () => {
        it('Positive: Must read content of file; String type by default', async () => {
            const pfs = new src_1.default();
            const { length } = pfs.read('./tmpdir/binapp', {
                sync: true
            });
            assert_1.default(length > 0);
        });
        it('Positive: Must read Buffer content of file when encoding is null', async () => {
            const pfs = new src_1.default();
            const raw = pfs.read('./tmpdir/binapp', {
                encoding: null,
                sync: true
            });
            assert_1.default(raw instanceof Buffer);
        });
        it('Positive: Must read content of file, when path is absolute', async () => {
            const pfs = new src_1.default();
            const cwd = process.cwd();
            const { length } = pfs.read(`${cwd}${path_1.sep}tmpdir${path_1.sep}binapp`, {
                sync: true,
                resolve: false
            });
            assert_1.default(length > 0);
        });
        it(`Negative: Throw if not exists resource`, async () => {
            const pfs = new src_1.default();
            const chance = new chance_1.default();
            const base = chance.guid();
            try {
                pfs.read(`./${base}`, {
                    sync: true
                });
            }
            catch (err) {
                assert_1.default(err.errno === -2);
            }
        });
    });
});
//# sourceMappingURL=read.spec.js.map