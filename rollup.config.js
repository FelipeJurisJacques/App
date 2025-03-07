// import { rollup } from 'rollup'
// import babel from '@rollup/plugin-babel'
import typescript from '@rollup/plugin-typescript'

export default {
  input: {
    'index': 'source/index.ts',
    'service-worker': 'source/service-worker.ts',
  },
  output: {
    format: 'es',
    sourcemap: false,
    dir: 'dist/',
    entryFileNames: (chunkInfo) => {
      return chunkInfo.name === 'index' ? 'index.mjs' : '[name].js';
    },
  },
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
    }),
    // babel({
    //   babelHelpers: 'bundled',
    // }),
  ]
}
