import * as fs from 'fs';
import zlib from 'zlib';

import { defineConfig, normalizePath } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { viteSingleFile } from "vite-plugin-singlefile"
import chalk from 'chalk';

const pkg = require("./package.json");
const target = pkg.proxy;

function buildHeaderFile() {
  let config;
  let inputPath;
  let outputPath;

  return {
    name: "build-header-file",
    apply: "build",
    enforce: "post",

    configResolved(resolvedConfig) {
      config = resolvedConfig;
      const outDir = config.build.outDir;
      inputPath = normalizePath(`${config.build.outDir}/index.html`);
      outputPath = normalizePath(`${config.root}/../src/Html.h`);
    },

    async closeBundle() {
      const input = fs.readFileSync(inputPath);
      const compressed = zlib.brotliCompressSync(input);
      const ratio = compressed.length / input.length;
      const hexlified = compressed.toString("hex").match(/.{2}/g).map(c => "0x" + c).reverse().join(", ");
      const output = `#define INDEX_HTML_LEN ${compressed.length}\nstatic const uint8_t INDEX_HTML[] PROGMEM = {${hexlified}};`;
      
      // Write header file only if a previous one exists
      // This avoids errors in development and GitHub actions
      if (fs.existsSync(outputPath)) {
        fs.writeFileSync(outputPath, output);
      } else {
        fs.writeFileSync(normalizePath(`${config.build.outDir}/index.h`), output);
      }

      config.logger.info(`\n${chalk.green("✓")} Compressed with Brotli: ${chalk.dim((compressed.length / 1024).toFixed(2) + " KiB (" + (ratio * 100).toFixed(1) + "%)")}`);
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "127.0.0.1",
    port: "3000",
    proxy: {
      // proxy all api calls to the espuino
      "/api": {
        target: target  // <-- change ip to the espuino
      },
      // websocket (if we ever need it)
      "/ws": {
        target: target.replace(/^http(s?):\/\//, "ws$1://"),
        ws: true
      }
    }
  },
  plugins: [
    svelte(),
    viteSingleFile(),
    buildHeaderFile()
  ]
})
