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
describe('remove(src [, options])', () => {
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
    it('Positive: Removal a directory with a file', async () => {
        const pfs = new src_1.default();
        await pfs.remove('./tmpdir');
        const exist = await pfs.test('./tmpdir');
        assert_1.default(exist === false);
    });
    it('Positive: Removal a directory with a file, when path is absolute', async () => {
        const pfs = new src_1.default();
        const cwd = process.cwd();
        await pfs.remove(`${cwd}${path_1.sep}tmpdir`, {
            resolve: false
        });
        const exist = await pfs.test('./tmpdir');
        assert_1.default(exist === false);
    });
    it('Negative: Throw if not exists resource', async () => {
        const pfs = new src_1.default();
        const chance = new chance_1.default();
        const base = chance.guid();
        try {
            await pfs.remove(`./${base}`);
        }
        catch (err) {
            assert_1.default(err.errno === -2);
        }
    });
    describe('sync mode', () => {
        it('Positive: Removal a directory with a file', async () => {
            const pfs = new src_1.default();
            pfs.remove('./tmpdir', {
                sync: true
            });
            const exist = await pfs.test('./tmpdir');
            assert_1.default(exist === false);
        });
        it('Positive: Removal a directory with a file, when path is absolute', async () => {
            const pfs = new src_1.default();
            const cwd = process.cwd();
            pfs.remove(`${cwd}${path_1.sep}tmpdir`, {
                sync: true,
                resolve: false
            });
            const exist = await pfs.test('./tmpdir');
            assert_1.default(exist === false);
        });
        it('Negative: Throw if not exists resource', async () => {
            const pfs = new src_1.default();
            const chance = new chance_1.default();
            const base = chance.guid();
            try {
                pfs.remove(`./${base}`, {
                    sync: true
                });
            }
            catch (err) {
                assert_1.default(err.errno === -2);
            }
        });
    });
});
//# sourceMappingURL=remove.spec.js.map