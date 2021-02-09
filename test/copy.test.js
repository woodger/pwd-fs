const assert = require('assert');
const mockFs = require('mock-fs');
const PoweredFileSystem = require('../dist');

describe('pfs.copy(src, dir [, options])', () => {
  const pfs = new PoweredFileSystem();

  describe('Interface', () => {
    it('Throw an exception if the option argument is not a object', async () => {
      try {
        await pfs.copy('./dir/file.txt', '.', null);
      }
      catch (err) {
        assert(err instanceof Error);
      }
    });

    const options = {
      umask: Number,
      resolve: Boolean,
      sync: Boolean
    };

    for (let i of Object.keys(options)) {
      const {name} = options[i];

      it(`Throw an exception if '${i}' value is not a ${name}`, async () => {
        try {
          await pfs.copy('./dir/file.txt', '.', {
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
    beforeEach(() => {
      mockFs({
        dir: {
          dir: mockFs.directory(),
          'file.txt': ''
        },
        dev: {
          'mock.txt': mockFs.file({
            mode: 0004
          }),
          'file.txt': ''
        }
      });
    });

    afterEach(() => {
      mockFs.restore();
    });

    it('Copying a directory with a file', async () => {
      await pfs.copy('./dir', './dev');

      const dstat = await pfs.stat('./dev/dir');
      const fstat = await pfs.stat('./dev/dir/file.txt');

      assert(
        dstat.bitmask === 0o777 &&
        fstat.bitmask === 0o666
      );
    });

    it(`Copying a directory with a file in 'sync' mode`, async () => {
      pfs.copy('./dir', './dev', {
        sync: true
      });

      const dstat = await pfs.stat('./dev/dir');
      const fstat = await pfs.stat('./dev/dir/file.txt');

      assert(
        dstat.bitmask === 0o777 &&
        fstat.bitmask === 0o666
      );
    });

    it('Search permission is denied on a component of the path prefix', async () => {
      try {
        await pfs.copy('./dev', './dir');
      }
      catch (err) {
        const index = err.message.indexOf('EACCES, permission denied');

        assert(index > -1);
      }
    });

    it('To a non-existent resource to return an Error', async () => {
      try {
        await pfs.copy('./non-existent.txt', '.');
      }
      catch (err) {
        const index = err.message.indexOf('ENOENT, no such file or directory');

        assert(index > -1);
      }
    });

    it('An attempt to copy to an existing resource should return an Error', async () => {
      try {
        await pfs.copy('./dir', '.');
      }
      catch (err) {
        const index = err.message.indexOf('EEXIST, file already exists');

        assert(index > -1);
      }
    });
  });
});
