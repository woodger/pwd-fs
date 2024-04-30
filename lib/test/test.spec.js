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
describe('test(src[, options])', () => {
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
    it(`Positive: Should return 'true' for current working directory`, async () => {
        const pfs = new src_1.default();
        const exist = await pfs.test('.');
        (0, assert_1.default)(exist);
    });
    it(`Positive: For existing directory should return 'true'`, async () => {
        const pfs = new src_1.default();
        const exist = await pfs.test('./tmpdir/libxbase');
        (0, assert_1.default)(exist);
    });
    it(`Positive: For existing file should return 'true'`, async () => {
        const pfs = new src_1.default();
        const exist = await pfs.test('./tmpdir/binapp');
        (0, assert_1.default)(exist);
    });
    it(`Positive: A non-existent file must return 'false'`, async () => {
        const pfs = new src_1.default();
        const chance = new chance_1.default();
        const base = chance.guid();
        const exists = await pfs.test(`./${base}`);
        (0, assert_1.default)(exists === false);
    });
    it(`Positive: Should return 'true' for absolute source`, async () => {
        const pfs = new src_1.default();
        const cwd = process.cwd();
        const exists = await pfs.test(`${cwd}${path_1.sep}tmpdir`, {
            resolve: false
        });
        (0, assert_1.default)(exists);
    });
    describe('sync mode', () => {
        it(`Positive: For existing directory should return 'true'`, () => {
            const pfs = new src_1.default();
            const exist = pfs.test('./tmpdir/libxbase', {
                sync: true
            });
            (0, assert_1.default)(exist);
        });
        it(`Positive: For existing file should return 'true'`, () => {
            const pfs = new src_1.default();
            const exist = pfs.test('./tmpdir/binapp', {
                sync: true
            });
            (0, assert_1.default)(exist);
        });
        it(`Positive: A non-existent file must return 'false'`, async () => {
            const pfs = new src_1.default();
            const chance = new chance_1.default();
            const base = chance.guid();
            const exists = pfs.test(`./${base}`, {
                sync: true
            });
            (0, assert_1.default)(exists === false);
        });
        it(`Positive: Should return 'true' for absolute source`, async () => {
            const pfs = new src_1.default();
            const cwd = process.cwd();
            const exists = pfs.test(`${cwd}${path_1.sep}tmpdir`, {
                sync: true,
                resolve: false
            });
            (0, assert_1.default)(exists);
        });
    });
});
