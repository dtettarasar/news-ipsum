// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({

  compatibilityDate: '2025-07-15',

  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {

    mongoUser: process.env.MONGO_INITDB_ROOT_USERNAME,
    mongoPass: process.env.MONGO_INITDB_ROOT_PASSWORD,
    mongoDbName: process.env.MONGO_DB_NAME || 'testdb',
    
  },

  modules: ['@nuxt/icon','@nuxtjs/tailwindcss'],

})
