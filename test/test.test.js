const assert = require('assert');
const mockFs = require('mock-fs');
const PoweredFileSystem = require('..');

describe('pfs.test(src[, options])', () => {
  const pfs = new PoweredFileSystem();

  describe('Interface', () => {
    it('Throw an exception if the option argument is not a object', async () => {
      try {
        await pfs.test('./dir/file.txt', null);
      }
      catch (err) {
        assert(err instanceof TypeError);
      }
    });

    it('An unknown flag should throw an exception', async () => {
      try {
        await pfs.test('./dir/file.txt', {
          flag: 'u'
        });
      }
      catch (err) {
        assert(err.message === "Unknown file test flag: u");
      }
    });

    const options = {
      flag: String,
      resolve: Boolean,
      sync: Boolean
    };

    for (let i of Object.keys(options)) {
      const {name} = options[i];

      it(`Throw an exception if '${i}' value is not a ${name}`, async () => {
        try {
          await pfs.test('./non-existent-file.txt', {
            [i]: null
          });
        }
        catch (err) {
          assert(
            err.message ===
            `Invalid value '${i}' in order '#test()'. Expected ${name}`
          );
        }
      });
    }
  });

  describe('File system access', () => {
    before(() => {
      mockFs({
        'dir/file.txt': ''
      });
    });

    after(() => {
      mockFs.restore();
    });

    it(`Should return 'true' for current working directory`, async () => {
      const exist = await pfs.test('.');
      assert(exist);
    });

    it(`For existing directory should return 'true'`, async () =>  {
      const exist = await pfs.test('./dir');
      assert(exist);
    });

    it(`For existing directory should return 'true' in 'sync' mode`, () =>  {
      const exist = pfs.test('./dir', {
        sync: true
      });

      assert(exist);
    });

    it(`For existing file should return 'true'`, async () => {
      const exist = await pfs.test('./dir/file.txt');
      assert(exist);
    });

    it(`For existing file should return 'true' in 'sync' mode`, () =>  {
      const exist = pfs.test('./dir/file.txt', {
        sync: true
      });

      assert(exist);
    });

    it(`A non-existent file must return 'false'`, async () => {
      const exists = await pfs.test('./non-existent-file.txt');
      assert(exists === false);
    });

    it(`A non-existent file must return 'false' in 'sync' mode`, () => {
      const exists = pfs.test('./non-existent-file.txt', {
        sync: true
      });

      assert(exists === false);
    });
  });
});
