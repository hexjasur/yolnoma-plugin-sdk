import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    plugin: 'src/index.tsx',
  },

  outDir: 'dist',

  format: ['esm'],

  target: 'es2020',

  clean: true,

  dts: false,

  sourcemap: true,

  splitting: false,

  bundle: true,

  external: [
    'react',
    'react-dom',
    '@yolnoma/plugin-sdk',
  ],

  outExtension() {
    return {
      js: '.js',
    };
  },
});