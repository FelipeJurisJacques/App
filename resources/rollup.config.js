import inject from '@rollup/plugin-inject'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'

const cssAsString = () => ({
  name: 'css-as-string',
  transform(code, id) {
    if (id.endsWith('.css')) {
      return {
        code: `export default ${JSON.stringify(code)};`,
        map: { mappings: '' }
      }
    }
  }
})

const commonPlugins = [
  cssAsString(),
  resolve(),
  commonjs(),
  inject({
    'HyperTextMarkupLanguage': ['/workspace/application/dls/HyperTextMarkupLanguage', 'HyperTextMarkupLanguage']
  }),
  typescript({
    tsconfig: './tsconfig.build.json'
  })
]

export default [
  // 1. Application Bundle
  {
    input: 'application/index.ts',
    output: {
      file: 'public/assets/application/application.mjs',
      format: 'esm',
      sourcemap: true
    },
    plugins: commonPlugins
  },

  // 2. Service Worker Bundle
  {
    input: 'application/service-worker.ts',
    output: {
      file: 'public/assets/application/service-worker.js',
      format: 'esm',
      sourcemap: true
    },
    plugins: commonPlugins
  }
]
