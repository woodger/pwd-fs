const assert = require('assert');
const mockFs = require('mock-fs');
const PoweredFileSystem = require('..');

describe('pfs.rename(src, use [, options])', () => {
  const pfs = new PoweredFileSystem();

  describe('Interface', () => {
    it('Throw an exception if the option argument is not a object', async () => {
      try {
        await pfs.rename('./dir/file.txt', './dir/dist.txt', null);
      }
      catch (err) {
        assert(err instanceof TypeError);
      }
    });

    const options = {
      resolve: Boolean,
      sync: Boolean
    };

    for (let i of Object.keys(options)) {
      const {name} = options[i];

      it(`Throw an exception if '${i}' value is not a ${name}`, async () => {
        try {
          await pfs.rename('./dir/file.txt', './dir/dist.txt', {
            [i]: null
          });
        }
        catch (err) {
          assert(
            err.message ===
            `Invalid value '${i}' in order '#rename()'. Expected ${name}`
          );
        }
      });
    }
  });

  describe('File system access', () => {
    beforeEach(() => {
      mockFs({
        'dir/file.txt': 'some text ...'
      });
    });

    afterEach(() => {
      mockFs.restore();
    });

    it('Must rename resource', async () => {
      await pfs.rename('./dir/file.txt', './dir/dist.txt');
      const exist = await pfs.test('./dir/dist.txt');

      assert(exist === true);
    });

    it(`Must rename resource in 'sync' mode`, async () => {
      pfs.rename('./dir/file.txt', './dir/dist.txt', {
        sync: true
      });

      const exist = await pfs.test('./dir/dist.txt');
      assert(exist === true);
    });

    it('To a non-existent resource to return an Error', async () => {
      try {
        await pfs.rename('./non-existent.txt', './dist.txt');
      }
      catch (err) {
        const index = err.message.indexOf('ENOENT, no such file or directory');
        assert(index > -1);
      }
    });
  });
});
