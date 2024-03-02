import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: './src/index.ts',
  output: {
    preserveModules: true,
    exports: 'named',
    dir: 'lib',
    format: 'cjs'
  },
  plugins: [
    nodeResolve(),
    typescript()
  ]
}
