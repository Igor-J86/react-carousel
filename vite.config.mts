import { defineConfig } from "vite";
import react from '@vitejs/plugin-react';

export default defineConfig({
  build: {
    outDir: "./static",
    assetsDir: ".",
    emptyOutDir: false,
    rollupOptions: {
      input: {
        "ijrc-carousel": "./style/ijrc-carousel.css"
      },
      output: {
        assetFileNames: 'ijrc-carousel[extname]'
      }
    }
  },
  plugins: [react()]
})