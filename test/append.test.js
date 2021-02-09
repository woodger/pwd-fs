const assert = require('assert');
const mockFs = require('mock-fs');
const PoweredFileSystem = require('../dist');

describe('pfs.append(src, data [, options])', () => {
  const pfs = new PoweredFileSystem();
  const content = 'more text ...';

  describe('Interface', () => {
    it('Throw an exception if the option argument is not a object', async () => {
      try {
        await pfs.append('./file.txt', content, null);
      }
      catch (err) {
        assert(err instanceof TypeError);
      }
    });

    const options = {
      encoding: String,
      umask: Number,
      flag: String,
      resolve: Boolean,
      sync: Boolean
    };

    for (let i of Object.keys(options)) {
      const {name} = options[i];

      it(`Throw an exception if '${i}' value is not a ${name}`, async () => {
        try {
          await pfs.append('./file.txt', content, {
            [i]: null
          });
        }
        catch (err) {
          assert(
            err.message ===
            `Invalid value '${i}' in order '#append()'. Expected ${name}`
          );
        }
      });
    }
  });

  describe('File system access', () => {
    beforeEach(() => {
      mockFs({
        'file.txt': 'some text ...'
      });
    });

    afterEach(() => {
      mockFs.restore();
    });

    it('Must append content to file', async () => {
      await pfs.append('./file.txt', content);
      const stat = await pfs.stat('./file.txt');

      assert(stat.size === 26);
    });

    it(`Must append content to file in 'sync' mode`, async () => {
      pfs.append('./file.txt', content, {
        sync: true
      });

      const stat = await pfs.stat('./file.txt');

      assert(stat.size === 26);
    });

    it(`Unexpected option 'flag' returns Error`, async () => {
      try {
        await pfs.append('./file.txt', content, {
          flag: 'r'
        });
      }
      catch (err) {
        assert(err.message === "EBADF, bad file descriptor");
      }
    });
  });
});
