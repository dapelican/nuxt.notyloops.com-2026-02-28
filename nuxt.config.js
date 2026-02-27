'use strict';

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxtjs/color-mode',
    '@nuxtjs/i18n',
    'nuxt-auth-utils',
  ],
  // to prevent weird warnings in the console locally
  devtools: {
    enabled: false,
  },
  app: {
    head: {
      link: [
        { rel: 'preload', as: 'font', type: 'font/woff2', crossorigin: 'anonymous', href: '/fonts/PermanentMarker/PermanentMarker.woff2' },
        { rel: 'preload', as: 'font', type: 'font/ttf', crossorigin: 'anonymous', href: '/fonts/RobotoSlab/RobotoSlab-ExtraBold.ttf' },
        { rel: 'preload', as: 'font', type: 'font/ttf', crossorigin: 'anonymous', href: '/fonts/RobotoSlab/RobotoSlab-Regular.ttf' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/images/brand/optileague-0016x0016.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/images/brand/optileague-0032x0032.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/images/brand/optileague-0180x0180.png' },
        { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/images/brand/optileague-0192x0192.png' },
        { rel: 'manifest', href: '/manifest.webmanifest' },
      ],
      title: 'OptiLeague',
    },
  },
  css: ['~/assets/css/main.css'],
  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: '',
    dataValue: 'theme',
  },
  // to make the environment variables declared in the .env file
  // available in the app folder (client-side) and the sever folder (server-side).
  // with the funtion useRuntimeConfig()
  runtimeConfig: {
    DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING,
    EMAILABLE_API_KEY: process.env.EMAILABLE_API_KEY,
    SESSION_MAX_AGE_DAYS: process.env.SESSION_MAX_AGE_DAYS,
    SMTP2GO_API_KEY: process.env.SMTP2GO_API_KEY,
    session: {
      // Implicitly used by nuxt-auth-utils
      maxAge: 60 * 60 * 24 * Number(process.env.SESSION_MAX_AGE_DAYS),
    },
  },
  compatibilityDate: '2026-02-21',
  eslint: {
    config: {
      stylistic: true,
    },
  },
  i18n: {
    defaultLocale: 'en',
    detectBrowserLanguage: false,
    differentDomains: true,
    locales: [
      {
        code: 'en',
        domain: `www.${process.env.DOMAIN}`,
        file: 'en.json',
        name: 'English',
      },
      {
        code: 'fr',
        domain: `fr.${process.env.DOMAIN}`,
        file: 'fr.json',
        name: 'Français',
      },
    ],
    strategy: 'no_prefix',
  },
});
