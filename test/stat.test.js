const assert = require('assert');
const mockFs = require('mock-fs');
const PoweredFileSystem = require('../dist');

describe(`pfs.stat(src [, options])`, () => {
  const pfs = new PoweredFileSystem();

  describe('Interface', () => {
    it('Throw an exception if the option argument is not a object', async () => {
      try {
        await pfs.stat('./dir/file.txt', null);
      }
      catch (err) {
        assert(err instanceof Error);
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
          await pfs.stat('./dir/file.txt', {
            [i]: null
          });
        }
        catch (err) {
          assert(err instanceof Error);
        }
      });
    }
  });

  describe('File system access', () => {
    before(() => {
      mockFs({
        dir: {
          symlink: mockFs.symlink({
            path: 'file.txt'
          }),
          'file.txt': 'some text ...'
        }
      });
    });

    after(() => {
      mockFs.restore();
    });

    it('Must return file information', async () => {
      const stat = await pfs.stat('./dir/file.txt');

      assert(
        stat.isFile() === true &&
        stat.size === 13
      );
    });

    it(`Must return file information in 'sync' mode`, () => {
      const stat = pfs.stat('./dir/file.txt', {
        sync: true
      });

      assert(
        stat.isFile() === true &&
        stat.size === 13
      );
    });

    it('Must return file information about the symlink', async () => {
      const stat = await pfs.stat('./dir/symlink');

      assert(stat.isSymbolicLink());
    });

    it('The bitmask field must match', async () => {
      const stat = await pfs.stat('./dir/file.txt');
      assert(stat.bitmask === 0o666);
    });

    it('To a non-existent resource to return an Error', async () => {
      try {
        await pfs.stat('./non-existent.txt');
      }
      catch (err) {
        const index = err.message.indexOf('ENOENT, no such file or directory');
        assert(index > -1);
      }
    });
  });
});
