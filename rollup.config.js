import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/vuequery.js',
      format: 'cjs'
    },
    {
      file: 'dist/vuequery.min.js',
      format: 'iife',
      plugins: [terser()],
      name: 'VueQuery'
    }
  ],
  external: ['vue'],
  plugins: [typescript()]
}
