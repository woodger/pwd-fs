"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const src_1 = require("../src");
describe('#constructor: new PoweredFileSystem(pwd?)', () => {
    it('Positive: An empty path must match the context of the cwd', () => {
        const { pwd } = new src_1.PoweredFileSystem();
        (0, node_assert_1.default)(pwd === process.cwd());
    });
    it('Positive: Absolute path must match the context of the pwd', () => {
        const { pwd } = new src_1.PoweredFileSystem(__dirname);
        (0, node_assert_1.default)(pwd === __dirname);
    });
});
