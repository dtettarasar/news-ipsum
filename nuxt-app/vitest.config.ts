import { defineConfig } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'
import path from 'path'

export default defineConfig({
  test: {
    // Configuration des projets (Workspaces)
    projects: [
      // 1. Projet Backend (Node pur, rapide)
      {
        test: {
          name: 'backend',
          include: ['tests/unit/backend/**/*.{test,spec}.ts'],
          environment: 'node',
        },
      },
      // 2. Projet Frontend (Environnement Nuxt)
      // On utilise "await" car defineVitestProject charge l'environnement Nuxt
      await defineVitestProject({
        test: {
          name: 'frontend',
          include: ['tests/unit/frontend/**/*.{test,spec}.ts'],
          environment: 'nuxt',
          environmentOptions: {
            nuxt: {
              domEnvironment: 'jsdom',
            }
          }
        },
      }),
    ],
    // Options globales partagées
    globals: true,
    watch: {
      usePolling: true, // Crucial pour Docker
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '~': path.resolve(__dirname, './'),
    },
  },
})