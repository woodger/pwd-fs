import assert from 'assert';
import crypto from 'crypto';
import mockFs from 'mock-fs';
import PoweredFileSystem  from '../src';

describe('#pfs.append(src, data [, options])', () => {
  beforeEach(async () => {
    const content: Buffer = await new Promise((resolve, reject) => {
      crypto.pseudoRandomBytes(32, (err: Error, raw: Buffer) => {
        if (err) {
          return reject(err);
        }

        resolve(raw);
      });
    });

    mockFs({
      'file.txt': content
    });
  });

  afterEach(mockFs.restore);

  it('Must append content to file', async () => {
    const pfs = new PoweredFileSystem();

    await pfs.append('./file.txt', 'more ...');
    const stat = await pfs.stat('./file.txt');

    assert(stat.size > 10);
  });

  it(`Must append content to file in 'sync' mode`, async () => {
    const pfs = new PoweredFileSystem();

    pfs.append('./file.txt', 'more ...', {
      sync: true
    });

    const stat = await pfs.stat('./file.txt');

    assert(stat.size > 10);
  });

  it(`Unexpected option 'flag' returns Error`, async () => {
    const pfs = new PoweredFileSystem();

    try {
      await pfs.append('./file.txt', 'more ...', {
        flag: 'r'
      });
    }
    catch (err) {
      assert(err.message === "EBADF, bad file descriptor");
    }
  });
});
