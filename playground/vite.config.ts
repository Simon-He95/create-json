/// <reference types="vitest" />

import path from 'path'
import fs from 'fs'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Unocss from 'unocss/vite'
const name = 'anteater-dev'
const myPlugin = (template_url: string) => {
  let content: string
  let outDir: string
  return {
    name: 'copy-html',
    apply: 'build',
    enforce: 'post',
    config(options: any) {
      content = fs.readFileSync(path.resolve(__dirname, template_url), 'utf-8')
      outDir = `${options.build?.outDir || 'dist'}/index.html`
    },
    buildEnd() {
      setTimeout(() => fs.writeFileSync(path.resolve(__dirname, outDir), content, 'utf-8'))
    },
  }
}
export default defineConfig({
  base: '/',
  // publicPath: '/apps/' + name,
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  build: {
    target: 'esnext',
    lib: {
      fileName: name,
      name,
      entry: path.resolve(__dirname, 'src/main.ts'),
    },
    cssTarget: 'esnext',
  },
  define: {
    'process.env': {},
  },
  plugins: [
    myPlugin('./template.html'),
    Vue({
      reactivityTransform: true,
    }),

    // https://github.com/hannoeru/vite-plugin-pages
    Pages(),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: [
        'vue',
        'vue/macros',
        'vue-router',
        '@vueuse/core',
      ],
      dts: true,
    }),

    // https://github.com/antfu/vite-plugin-components
    Components({
      dts: true,
    }),

    // https://github.com/antfu/unocss
    // see unocss.config.ts for config
    Unocss(),
  ],

  // https://github.com/vitest-dev/vitest
  test: {
    environment: 'jsdom',
  },
})
