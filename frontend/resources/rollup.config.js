import inject from '@rollup/plugin-inject'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'

const cssAsStylesheet = () => ({
  name: 'css-as-stylesheet',
  transform(code, id) {
    if (id.endsWith('.css')) {
      return {
        code: `const sheet = new CSSStyleSheet();\nsheet.replaceSync(${JSON.stringify(code)});\nexport default sheet;`,
        map: { mappings: '' }
      }
    }
  }
})

const svgAsElement = () => ({
  name: 'svg-as-element',
  transform(code, id) {
    if (id.endsWith('.svg')) {
      return {
        code: `const template = document.createElement('div');
template.innerHTML = ${JSON.stringify(code.trim())};
const source = template.firstChild;
const svg = document.createElementNS('http://www.w3.org/2000/svg', source.tagName ? source.tagName.toLowerCase() : 'svg');
if (source.attributes) {
  for (let i = 0; i < source.attributes.length; i++) {
    const attr = source.attributes[i];
    svg.setAttribute(attr.name, attr.value);
  }
}
svg.innerHTML = source.innerHTML;
export default svg;`,
        map: { mappings: '' }
      }
    }
  }
})

const commonPlugins = [
  cssAsStylesheet(),
  svgAsElement(),
  resolve(),
  commonjs(),
  inject({
    'Web': ['/workspace/resources/application/dls/Web', 'Web']
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
      file: '/workspace/public/assets/application/application.mjs',
      format: 'esm',
      sourcemap: true
    },
    plugins: commonPlugins
  },

  // 2. Service Worker Bundle
  {
    input: 'application/service-worker.ts',
    output: {
      file: '/workspace/public/assets/application/service-worker.js',
      format: 'esm',
      sourcemap: true
    },
    plugins: commonPlugins
  }
]
