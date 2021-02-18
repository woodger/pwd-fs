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
describe('write(src, data[, options])', () => {
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
    it('Positive: Must write content to file', async () => {
        const pfs = new src_1.default();
        const chance = new chance_1.default();
        const base = chance.guid();
        const exists = await pfs.test(`./tmpdir/${base}`);
        assert_1.default(exists === false);
        const payload = chance.paragraph();
        await pfs.write(`./tmpdir/${base}`, payload);
        const stats = await pfs.stat(`./tmpdir/${base}`);
        assert_1.default(stats.size > 0);
    });
    it('Positive: Must rewrite content if file already exists', async () => {
        const pfs = new src_1.default();
        const chance = new chance_1.default();
        const payload = chance.paragraph();
        await pfs.write('./tmpdir/binapp', payload);
        const stats = await pfs.stat(`./tmpdir/binapp`);
        assert_1.default(stats.size > 0);
    });
    it(`Positive: Must write content to file, when path is absolute`, async () => {
        const pfs = new src_1.default();
        const chance = new chance_1.default();
        const payload = chance.paragraph();
        const cwd = process.cwd();
        await pfs.write(`${cwd}${path_1.sep}tmpdir${path_1.sep}binapp`, payload, {
            resolve: false
        });
        const stats = await pfs.stat(`./tmpdir/binapp`);
        assert_1.default(stats.size > 0);
    });
    it('Negative: Throw if resource is directory', async () => {
        const pfs = new src_1.default();
        const chance = new chance_1.default();
        try {
            const payload = chance.paragraph();
            await pfs.write('./tmpdir/libxbase', payload);
        }
        catch (err) {
            assert_1.default(err.errno === -21);
        }
    });
    it(`Negative: Unexpected option 'flag' returns Error`, async () => {
        const pfs = new src_1.default();
        const chance = new chance_1.default();
        try {
            const payload = chance.paragraph();
            await pfs.write('./tmpdir/binapp', payload, {
                flag: 'r'
            });
        }
        catch (err) {
            assert_1.default(err.errno === -9);
        }
    });
    describe('sync mode', () => {
        it('Positive: Must write content to file', async () => {
            const pfs = new src_1.default();
            const chance = new chance_1.default();
            const base = chance.guid();
            const exists = await pfs.test(`./tmpdir/${base}`);
            assert_1.default(exists === false);
            const payload = chance.paragraph();
            pfs.write(`./tmpdir/${base}`, payload, {
                sync: true
            });
            const stats = await pfs.stat(`./tmpdir/${base}`);
            assert_1.default(stats.size > 0);
        });
        it(`Positive: Must write content to file, when path is absolute`, async () => {
            const pfs = new src_1.default();
            const chance = new chance_1.default();
            const payload = chance.paragraph();
            const cwd = process.cwd();
            pfs.write(`${cwd}${path_1.sep}tmpdir${path_1.sep}binapp`, payload, {
                sync: true,
                resolve: false
            });
            const stats = await pfs.stat(`./tmpdir/binapp`);
            assert_1.default(stats.size > 0);
        });
        it('Negative: Throw if resource is directory', async () => {
            const pfs = new src_1.default();
            const chance = new chance_1.default();
            try {
                const payload = chance.paragraph();
                pfs.write('./tmpdir/libxbase', payload, {
                    sync: true
                });
            }
            catch (err) {
                assert_1.default(err.errno === -21);
            }
        });
        it(`Negative: Unexpected option 'flag' returns Error`, async () => {
            const pfs = new src_1.default();
            const chance = new chance_1.default();
            try {
                const payload = chance.paragraph();
                pfs.write('./tmpdir/binapp', payload, {
                    sync: true,
                    flag: 'r'
                });
            }
            catch (err) {
                assert_1.default(err.errno === -9);
            }
        });
    });
});
//# sourceMappingURL=write.spec.js.map