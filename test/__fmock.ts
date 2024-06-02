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
      fs.symlinkSync(value.target, src);
    }
  }
}

export function restore(tmpDir: string) {
  const removeRecursive = (src: string) => {
    if (fs.existsSync(src)) {
      fs.readdirSync(src).forEach((item) => {
        const curl = `${src}/${item}`;

        fs.lstatSync(curl).isDirectory()
          ? removeRecursive(curl)
          : fs.unlinkSync(curl);
      });

      fs.rmdirSync(src);
    }
  };

  removeRecursive(tmpDir);
}
