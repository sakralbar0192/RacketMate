import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { defineConfig } from 'eslint/config'
import stylistic from '@stylistic/eslint-plugin-js'

export default defineConfig([
  { files: [ '**/*.{js,mjs,cjs,ts,mts,cts}' ], plugins: { js, '@stylistic': stylistic }, extends: [ 'js/recommended' ] },
  { files: [ '**/*.{js,mjs,cjs,ts,mts,cts}' ], languageOptions: { globals: globals.browser } },
  tseslint.configs.recommended,
  {
    'rules': {
      'indent': [ 2, 2 ],
      'space-before-function-paren': 'off',
      'quotes': [ 2, 'single', { 'avoidEscape': true } ],
      'semi': [ 'error', 'never' ],
      'object-curly-spacing': [ 'error', 'always' ],
      'array-bracket-spacing': [ 'error', 'always' ],
      '@typescript-eslint/consistent-type-imports': [ 'error', {
        'prefer': 'type-imports',
        'disallowTypeAnnotations': false
      } ],
      '@typescript-eslint/no-unused-vars': [ 'error' ],
      '@typescript-eslint/no-empty-interface': [ 'error' ],
      '@stylistic/no-trailing-spaces': [ 'error', {
        skipBlankLines: false,
        ignoreComments: false
      } ],
      'no-trailing-spaces': [ 'error', {
        skipBlankLines: false,
        ignoreComments: false
      } ],
      'no-multiple-empty-lines': [ 'error', {
        max: 1,
        maxBOF: 0,
        maxEOF: 0
      } ],
      'space-before-blocks': [ 'error', 'always' ],
      'keyword-spacing': [ 'error', {
        'before': true,
        'after': true
      } ],
    }
  }
])
