import prettierPlugin from 'eslint-plugin-prettier/recommended';
import cypress from 'eslint-plugin-cypress';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';

export default [
  {
    ignores: ['node_modules/**', 'dist/**'],
  },
  ...svelte.configs['flat/recommended'],
  prettierPlugin,
  cypress.configs.globals,
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
];
