"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_os_1 = __importDefault(require("node:os"));
const node_path_1 = __importDefault(require("node:path"));
const chance_1 = __importDefault(require("chance"));
const node_test_1 = require("node:test");
const index_1 = require("../index");
const test_utils_1 = require("../test-utils");
(0, node_test_1.describe)('mkdir(src [, options])', () => {
    const pfs = new index_1.PoweredFileSystem();
    const chance = new chance_1.default();
    (0, node_test_1.beforeEach)(() => {
        (0, test_utils_1.fmock)({
            './tmpdir/tings.txt': {
                type: 'file',
                data: chance.string()
            }
        });
    });
    (0, node_test_1.afterEach)(() => {
        (0, test_utils_1.restore)('./tmpdir');
    });
    (0, node_test_1.it)('Positive: Create directories in the working directory', async () => {
        const guid = chance.guid();
        await pfs.mkdir(`./tmpdir/${guid}`);
        const exist = node_fs_1.default.existsSync(`./tmpdir/${guid}`);
        (0, node_assert_1.default)(exist);
    });
    (0, node_test_1.it)('Positive: Make current directory', async () => {
        const guid = chance.guid();
        const nextPfs = new index_1.PoweredFileSystem(`./tmpdir/${guid}`);
        await nextPfs.mkdir('.');
        const exist = node_fs_1.default.existsSync(`./tmpdir/${guid}`);
        (0, node_assert_1.default)(exist);
    });
    (0, node_test_1.it)('Positive: Should work fine with the existing directory', async () => {
        const guid = chance.guid();
        for (let i = 2; i; i--) {
            await pfs.mkdir(`./tmpdir/${guid}`);
        }
        const exist = node_fs_1.default.existsSync(`./tmpdir/${guid}`);
        (0, node_assert_1.default)(exist);
    });
    (0, node_test_1.it)('Negative: Throw an exception if trying to create a directory in file', async () => {
        const guid = chance.guid();
        await node_assert_1.default.rejects(async () => {
            await pfs.mkdir(`./tmpdir/tings.txt/${guid}`);
        });
    });
    (0, node_test_1.it)('[sync] Positive: Create directories in the working directory', () => {
        const guid = chance.guid();
        pfs.mkdir(`./tmpdir/${guid}`, {
            sync: true
        });
        const exist = node_fs_1.default.existsSync(`./tmpdir/${guid}`);
        (0, node_assert_1.default)(exist);
    });
    (0, node_test_1.it)('[sync] Positive: Make current directory', () => {
        const guid = chance.guid();
        const nextPfs = new index_1.PoweredFileSystem(`./tmpdir/${guid}`);
        nextPfs.mkdir('.', {
            sync: true
        });
        const exist = node_fs_1.default.existsSync(`./tmpdir/${guid}`);
        (0, node_assert_1.default)(exist);
    });
    (0, node_test_1.it)('[sync] Positive: Should work fine with the existing directory', () => {
        const guid = chance.guid();
        for (let i = 2; i; i--) {
            pfs.mkdir(`./tmpdir/${guid}`, {
                sync: true
            });
        }
        const exist = node_fs_1.default.existsSync(`./tmpdir/${guid}`);
        (0, node_assert_1.default)(exist);
    });
    (0, node_test_1.it)('[sync] Negative: Throw an exception if trying to create a directory in file', () => {
        const guid = chance.guid();
        node_assert_1.default.throws(() => {
            pfs.mkdir(`./tmpdir/tings.txt/${guid}`, {
                sync: true
            });
        });
    });
    (0, node_test_1.it)('[sync] Positive: Absolute pwd should create the target directory itself', () => {
        const guid = chance.guid();
        const target = node_path_1.default.join(node_os_1.default.tmpdir(), guid);
        const nextPfs = new index_1.PoweredFileSystem(target);
        try {
            nextPfs.mkdir('.', {
                sync: true
            });
            (0, node_assert_1.default)(node_fs_1.default.existsSync(target));
        }
        finally {
            node_fs_1.default.rmSync(target, { recursive: true, force: true });
        }
    });
});
