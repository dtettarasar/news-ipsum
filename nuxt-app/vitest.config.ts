import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom', // simule un navigateur
    globals: true, // pour ne pas devoir importer "describe", "it", "expect"
  },
})
