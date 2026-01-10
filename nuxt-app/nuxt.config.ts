// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({

  compatibilityDate: '2025-07-15',

  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {

    // PRIVÉ (Uniquement serveur)
    mongoUser: process.env.MONGO_INITDB_ROOT_USERNAME,
    mongoPass: process.env.MONGO_INITDB_ROOT_PASSWORD,
    mongoDbName: process.env.MONGO_DB_NAME || 'testdb',

    // PUBLIC (Serveur + Client)
    public: {
      seoIndex: false, // Valeur de secours par défaut
    }
    
  },

  modules: ['@nuxt/icon','@nuxtjs/tailwindcss', '@pinia/nuxt',],

})
