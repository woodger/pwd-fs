const assert = require('assert');
const mockFs = require('mock-fs');
const PoweredFileSystem = require('..');

describe('pfs.chown(src, uid, gid [, options])', () => {
  const pfs = new PoweredFileSystem();

  describe('Interface', () => {
    it('Throw an exception if the option argument is not a object', async () => {
      try {
        await pfs.chown('./dir/file.txt', 0, 0, null);
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
          await pfs.chown('./dir/file.txt', 0, 0, {
            [i]: null
          });
        }
        catch (err) {
          assert(
            err.message ===
            `Invalid value '${i}' in order '#chown()'. Expected ${name}`
          );
        }
      });
    }
  });

  describe('File system access', () => {
    beforeEach(() => {
      mockFs({
        dir: mockFs.directory({
          items: {
            dir: mockFs.directory(),
            'file.txt': ''
          }
        }),
        dev: mockFs.directory({
          mode: 0400,
          items: {
            'file.txt': ''
          }
        })
      });
    });

    afterEach(() => {
      mockFs.restore();
    });

    it('Changes the permissions of a file', async () => {
      await pfs.chown('./dir/file.txt', 0, 0);
      const stat = await pfs.stat('./dir/file.txt');

      assert(
        stat.uid === 0 &&
        stat.gid === 0
      );
    });

    it('Changes the permissions of a directory', async () => {
      await pfs.chown('./dir', 0, 0);
      const stat = await pfs.stat('./dir');

      assert(
        stat.uid === 0 &&
        stat.gid === 0
      );
    });

    it(`Changes the permissions of a file in 'sync' mode`, async () => {
      pfs.chown('./dir/file.txt', 1, 1, {
        sync: true
      });

      const stat = await pfs.stat('./dir/file.txt');

      assert(
        stat.uid === 1 &&
        stat.gid === 1
      );
    });

    it('Changes the permissions of a directory in sync mode', async () => {
      await pfs.chown('./dir', 1, 1, {
        sync: true
      });

      const stat = await pfs.stat('./dir');

      assert(
        stat.uid === 1 &&
        stat.gid === 1
      );
    });

    it('Search permission is denied on a component of the path prefix', async () => {
      try {
        await pfs.chown('./dev', 0, 0);
      }
      catch (err) {
        const index = err.message.indexOf('EACCES, permission denied');

        assert(index > -1);
      }
    });

    it('To a non-existent resource to return an Error', async () => {
      try {
        await pfs.chown('./non-existent.txt', 0, 0);
      }
      catch (err) {
        const index = err.message.indexOf('ENOENT, no such file or directory');

        assert(index > -1);
      }
    });
  });
});
