import fs from 'node:fs';
import path from 'node:path';

export interface Iframe {
  [key: string]: any
}

export function fmock(frame: Iframe) {  
  for (const src of Object.keys(frame)) {
    const { dir } = path.parse(src);
    const value = frame[src];

    fs.mkdirSync(dir, { recursive: true });
    
    if (value.type === 'directory') {
      fs.mkdirSync(src);
    }
    
    if (value.type === 'file') {
      fs.writeFileSync(src, value.data);
    }
    
    if (value.type === 'symlink') {
      let type: fs.symlink.Type | undefined;

      if (process.platform === 'win32') {
        const stats = fs.lstatSync(value.target);
        type = stats.isDirectory() ? 'junction' : 'file';
      }

      fs.symlinkSync(value.target, src, type);
    }
  }
}

export function restore(tmpDir: string) {
  const removeRecursive = (src: string) => {
    if (fs.existsSync(src)) {
      fs.readdirSync(src).forEach((item) => {
        const curl = path.join(src, item);

        if (fs.lstatSync(curl).isDirectory()) {
          removeRecursive(curl);
        }
        else {
          fs.unlinkSync(curl);
        }
      });

      fs.rmdirSync(src);
    }
  };

  removeRecursive(tmpDir);
}
