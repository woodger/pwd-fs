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
describe('append(src, data [, options])', () => {
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
    it('Positive: Must append content to file', async () => {
        const pfs = new src_1.default();
        const chance = new chance_1.default();
        const before = await pfs.stat('./tmpdir/binapp');
        const payload = chance.string();
        await pfs.append('./tmpdir/binapp', payload);
        const after = await pfs.stat('./tmpdir/binapp');
        assert_1.default(after.size > before.size);
    });
    it('Positive: Must append content to file when path is absolute', async () => {
        const pfs = new src_1.default();
        const chance = new chance_1.default();
        const before = await pfs.stat('./tmpdir/binapp');
        const cwd = process.cwd();
        const payload = chance.string();
        await pfs.append(`${cwd}${path_1.sep}tmpdir${path_1.sep}binapp`, payload, {
            resolve: false
        });
        const after = await pfs.stat('./tmpdir/binapp');
        assert_1.default(after.size > before.size);
    });
    it(`Negative: Unexpected option 'flag' returns Error`, async () => {
        const pfs = new src_1.default();
        const chance = new chance_1.default();
        try {
            const payload = chance.string();
            await pfs.append('./tmpdir/binapp', payload, {
                flag: 'r'
            });
        }
        catch (err) {
            assert_1.default(err.errno === -9);
        }
    });
    describe('sync mode', () => {
        it(`Positive: Must append content to file`, async () => {
            const pfs = new src_1.default();
            const chance = new chance_1.default();
            const before = await pfs.stat('./tmpdir/binapp');
            const payload = chance.string();
            pfs.append('./tmpdir/binapp', payload, {
                sync: true
            });
            const after = await pfs.stat('./tmpdir/binapp');
            assert_1.default(after.size > before.size);
        });
        it('Positive: Must append content to file when path is absolute', async () => {
            const pfs = new src_1.default();
            const chance = new chance_1.default();
            const before = await pfs.stat('./tmpdir/binapp');
            const cwd = process.cwd();
            const payload = chance.string();
            pfs.append(`${cwd}${path_1.sep}tmpdir${path_1.sep}binapp`, payload, {
                sync: true,
                resolve: false
            });
            const after = await pfs.stat('./tmpdir/binapp');
            assert_1.default(after.size > before.size);
        });
        it(`Negative: Unexpected option 'flag' returns Error`, async () => {
            const pfs = new src_1.default();
            const chance = new chance_1.default();
            try {
                const payload = chance.string();
                pfs.append('./tmpdir/binapp', payload, {
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
//# sourceMappingURL=append.spec.js.map