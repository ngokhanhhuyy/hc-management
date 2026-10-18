import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';
import pluginVue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';
import { defineConfig } from 'eslint/config';

/** @type {import("eslint").Linter.Config[]} */
export default defineConfig([
  // 1. Global Ignores
  { ignores: ['**/dist/**', '**/node_modules/**'] },

  // 32. Recommended Base Standards
  ...tseslint.configs.recommended,
  pluginJs.configs.recommended,
  // ...pluginVue.configs['flat/recommended'],

  // 3. Base Configuration
  {
    files: ['**/*.{js,mjs,cjs,ts,vue}'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'no-undef': 'off',
      'no-unused-vars': 'off',
      'no-case-declarations': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-redeclare': 'off',
    },
  },

  // 4. Vue Parser Setup
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
        sourceType: 'module',
      },
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/v-bind-style': 'off',
      'vue/v-on-style': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/html-self-closing': 'off'
    },
  },

  // 5. Global Custom Rules
  {
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      '@stylistic/semi-style': ['error', 'last'],
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/quotes': ['warn', 'single', { avoidEscape: true }],
      semi: 'off',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '@/(api|helpers|stores)/([a-zA-Z-_]+)',
              message: 'Must import via index.ts when importing from the outside of the package.',
            },
          ],
        },
      ],
      'no-useless-assignment': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      'no-case-declarations': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
    },
  },
]);
