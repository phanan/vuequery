import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/vuequery.min.js',
    format: 'cjs'
  },
  external: ['vue'],
  plugins: [
    typescript(),
    terser()
  ]
}
