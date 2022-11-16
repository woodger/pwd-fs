"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const src_1 = __importDefault(require("../src"));
describe('#constructor: new PoweredFileSystem(path)', () => {
    it('Positive: Must be backwards compatible with #require', () => {
        (0, assert_1.default)(require('../src') === src_1.default);
    });
    it('Positive: An empty path must match the context of the cwd', () => {
        const { pwd } = new src_1.default();
        (0, assert_1.default)(pwd === process.cwd());
    });
    it('Positive: Absolute path must match the context of the pwd', () => {
        const { pwd } = new src_1.default(__dirname);
        (0, assert_1.default)(pwd === __dirname);
    });
});
