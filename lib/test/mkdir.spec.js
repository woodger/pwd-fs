"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const os_1 = __importDefault(require("os"));
const path_1 = require("path");
const mock_fs_1 = __importDefault(require("mock-fs"));
const chance_1 = __importDefault(require("chance"));
const src_1 = __importDefault(require("../src"));
describe('mkdir(src [, options])', () => {
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
    it('Positive: Create directories in the working directory', async () => {
        const pfs = new src_1.default();
        const chance = new chance_1.default();
        const base = chance.guid();
        await pfs.mkdir(`./tmpdir/${base}`);
        const exist = await pfs.test(`./tmpdir/${base}`);
        (0, assert_1.default)(exist);
    });
    it(`Positive: Make current directory`, async () => {
        const pfs = new src_1.default('./tmpdir');
        await pfs.mkdir('.');
        const exist = await pfs.test('.');
        (0, assert_1.default)(exist);
    });
    it(`Positive: Make current directory, when current directory is absolute path`, async () => {
        const pfs = new src_1.default('./tmpdir');
        await pfs.mkdir(process.cwd());
        const exist = await pfs.test('.');
        (0, assert_1.default)(exist);
    });
    it('Positive: Should work fine with the existing directory', async () => {
        const pfs = new src_1.default();
        const chance = new chance_1.default();
        const base = chance.guid();
        for (const item of [base, base]) {
            await pfs.mkdir(`./tmpdir/${item}`);
            const exist = await pfs.test(`./tmpdir/${item}`);
            (0, assert_1.default)(exist);
        }
    });
    it('Positive: Create directories when path is absolute', async () => {
        const pfs = new src_1.default();
        const chance = new chance_1.default();
        const tmpdir = os_1.default.tmpdir();
        const base = chance.guid();
        await pfs.mkdir(`${tmpdir}${path_1.sep}${base}`, {
            resolve: false
        });
        const exist = await pfs.test(`${tmpdir}${path_1.sep}${base}`);
        (0, assert_1.default)(exist);
    });
    it('Negative: Throw an exception if trying to create a directory in file', async () => {
        const pfs = new src_1.default();
        const chance = new chance_1.default();
        const base = chance.guid();
        try {
            await pfs.mkdir(`./tmpdir/binapp/${base}`);
        }
        catch (err) {
            (0, assert_1.default)(err.errno === -20);
        }
    });
    describe('sync mode', () => {
        it('Positive: Create directories in the working directory', async () => {
            const pfs = new src_1.default();
            const chance = new chance_1.default();
            const base = chance.guid();
            pfs.mkdir(`./tmpdir/${base}`, {
                sync: true
            });
            const exist = await pfs.test(`./tmpdir/${base}`);
            (0, assert_1.default)(exist);
        });
        it('Positive: Make current directory', async () => {
            const pfs = new src_1.default('./tmpdir');
            pfs.mkdir('.', {
                sync: true
            });
            const exist = await pfs.test('.');
            (0, assert_1.default)(exist);
        });
        it('Positive: Should work fine with the existing directory', async () => {
            const pfs = new src_1.default();
            const chance = new chance_1.default();
            const base = chance.guid();
            for (const item of [base, base]) {
                pfs.mkdir(`./tmpdir/${item}`, {
                    sync: true
                });
                const exist = await pfs.test(`./tmpdir/${item}`);
                (0, assert_1.default)(exist);
            }
        });
        it('Positive: Create directories when path is absolute', async () => {
            const pfs = new src_1.default();
            const chance = new chance_1.default();
            const tmpdir = os_1.default.tmpdir();
            const base = chance.guid();
            pfs.mkdir(`${tmpdir}${path_1.sep}${base}`, {
                sync: true,
                resolve: false
            });
            const exist = await pfs.test(`${tmpdir}${path_1.sep}${base}`);
            (0, assert_1.default)(exist);
        });
        it('Positive: Create in current directories when path is absolute', async () => {
            const pfs = new src_1.default();
            const chance = new chance_1.default();
            const cwd = process.cwd();
            const base = chance.guid();
            pfs.mkdir(`${cwd}${path_1.sep}${base}`, {
                sync: true,
                resolve: false
            });
            const exist = await pfs.test(base);
            (0, assert_1.default)(exist);
        });
        it('Negative: Throw an exception if trying to create a directory in file', async () => {
            const pfs = new src_1.default();
            const chance = new chance_1.default();
            const base = chance.guid();
            try {
                pfs.mkdir(`./tmpdir/binapp/${base}`, {
                    sync: true
                });
            }
            catch (err) {
                (0, assert_1.default)(err.errno === -20);
            }
        });
    });
});
