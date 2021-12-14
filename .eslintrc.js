/*eslint-env node*/
module.exports = {
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  env: {
    es6: true,
    browser: true,
    "cypress/globals": true
  },
  plugins: ['prettier', 'svelte3', 'cypress'],
  extends: ['eslint:recommended'],
  overrides: [
    {
      files: ['**/*.svelte'],
      processor: 'svelte3/svelte3',
    },
  ],
  settings: {
    'svelte3/ignore-styles': () => true,
  }
};
