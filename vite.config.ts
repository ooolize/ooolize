/*
 * @Description:
 * @Author: lize
 * @Date: 2023-11-09
 * @LastEditors: lize
 */
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { basename, dirname, resolve } from "node:path";
import Pages from "vite-plugin-pages";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Pages({
      dirs: "src/views",
      // extensions: ["vue"],
    }),
    vue(),
  ],
  server: {
    host: "127.0.0.1",
    port: 7272,
  },
  resolve: {
    alias: [{ find: "@/", replacement: `${resolve(__dirname, "src")}/` }],
  },
});
