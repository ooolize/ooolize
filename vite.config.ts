/*
 * @Description: 
 * @Author: lize
 * @Date: 2023-11-09
 * @LastEditors: lize
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { basename, dirname, resolve } from 'node:path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      { find: '@/', replacement: `${resolve(__dirname, 'src')}/` },
    ],
  },
})
