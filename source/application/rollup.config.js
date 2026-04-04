import inject from '@rollup/plugin-inject'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'

const commonPlugins = [
  resolve(),
  commonjs(),
  inject({
    'HyperTextMarkupLanguage': ['/workspace/source/application/dls/HyperTextMarkupLanguage', 'HyperTextMarkupLanguage']
  }),
  typescript({
    tsconfig: './tsconfig.build.json'
  })
]

export default [
  // 1. Application Bundle
  {
    input: 'source/application/index.ts',
    output: {
      file: 'public/assets/application/application.mjs',
      format: 'esm',
      sourcemap: true
    },
    plugins: commonPlugins
  },

  // 2. Service Worker Bundle
  {
    input: 'source/application/service-worker.ts',
    output: {
      file: 'public/assets/application/service-worker.js',
      format: 'esm',
      sourcemap: true
    },
    plugins: commonPlugins
  }
]
