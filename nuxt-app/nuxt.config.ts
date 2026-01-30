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

    // Auth keys
    jwtSecret: process.env.JWT_SECRET,
    encryptionKey: process.env.ENCRYPTION_KEY,
    sessionPassword: process.env.SESSION_PASSWORD,

    // PUBLIC (Serveur + Client)
    public: {
      seoIndex: false, // Valeur de secours par défaut
    }
    
  },

  vite: {
    esbuild: {
      // En production : retire console.* et debugger du bundle (client ET serveur).
      // Double bénéfice : pas de logs sensibles côté navigateur, et côté serveur
      // les console.warn/error ajoutés pour le diagnostic ne s'affichent qu'en dev.
      drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    },
  },

  modules: ['@nuxt/icon','@nuxtjs/tailwindcss', '@pinia/nuxt',],

})
