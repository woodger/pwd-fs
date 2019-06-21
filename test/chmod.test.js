const assert = require('assert');
const mockFs = require('mock-fs');
const PoweredFileSystem = require('..');

describe('pfs.chmod(src, mode [, options])', () => {
  const pfs = new PoweredFileSystem();

  describe('Interface', () => {
    it('Throw an exception if the option argument is not a object', async () => {
      try {
        await pfs.chmod('./dir/file.txt', 0o744, null);
      }
      catch (err) {
        assert(
          err.message ===
          "Cannot destructure property `resolve` of 'undefined' or 'null'."
        );
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
          await pfs.chmod('./dir/file.txt', 0o744, {
            [i]: null
          });
        }
        catch (err) {
          assert(
            err.message ===
            `Invalid value '${i}' in order '#chmod()'. Expected ${name}`
          );
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

    it('Changes directory and file permissions', async () => {
      await pfs.chmod('./dir', 0o744);
      const stat = await pfs.stat('./dir/file.txt');

      assert(stat.bitmask === 0o744);
    });

    it(`Changes directory and file permissions in 'sync' mode`, async () => {
      pfs.chmod('./dir', 0o744, {
        sync: true
      });

      const stat = await pfs.stat('./dir/file.txt');
      assert(stat.bitmask === 0o744);
    });

    it('Search permission is denied on a component of the path prefix', async () => {
      try {
        await pfs.chmod('./dev', 0, 0);
      }
      catch (err) {
        const index = err.message.indexOf('EACCES, permission denied');
        assert(index > -1);
      }
    });

    it('To a non-existent resource to return an Error', async () => {
      try {
        await pfs.chmod('./non-existent.txt', 0o744);
      }
      catch (err) {
        const index = err.message.indexOf('ENOENT, no such file or directory');

        assert(index > -1);
      }
    });
  });
});
