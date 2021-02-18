"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const src_1 = __importDefault(require("../src"));
describe('static bitmask(mode: number)', () => {
    it('Positive: Calculate bitmask', () => {
        assert_1.default(src_1.default.bitmask(33024) === 0o400); // (r--------)
        assert_1.default(src_1.default.bitmask(33152) === 0o600); // (rw-------)
        assert_1.default(src_1.default.bitmask(33216) === 0o700); // (rwx------)
        assert_1.default(src_1.default.bitmask(32800) === 0o040); // (---r-----)
        assert_1.default(src_1.default.bitmask(32816) === 0o060); // (---rw----)
        assert_1.default(src_1.default.bitmask(32824) === 0o070); // (---rwx---)
        assert_1.default(src_1.default.bitmask(32772) === 0o004); // (------r--)
        assert_1.default(src_1.default.bitmask(32774) === 0o006); // (------rw-)
        assert_1.default(src_1.default.bitmask(32775) === 0o007); // (------rwx)
    });
    it(`Negative: Throw an exception if the argument is 'null' type`, () => {
        try {
            // @ts-ignore
            src_1.default.bitmask(null);
        }
        catch (err) {
            assert_1.default(err);
        }
    });
});
//# sourceMappingURL=bitmask.spec.js.map