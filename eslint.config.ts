import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import importSort from 'eslint-plugin-simple-import-sort';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    files: ['**/*.ts'],
    ignores: ['dist', 'node_modules'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',

      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        projectService: true,
      },
    },
    linterOptions: {
      noInlineConfig: true,
      reportUnusedDisableDirectives: true,
    },
  },

  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  eslintPluginUnicorn.configs.recommended,

  {
    settings: {
      'import/resolver': {
        typescript: true,
        node: true,
      },
    },
  },

  {
    plugins: {
      'simple-import-sort': importSort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },

  {
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        { accessibility: 'explicit', overrides: { constructors: 'off' } },
      ],
      '@typescript-eslint/member-ordering': 'error',
      'no-magic-numbers': 'error',
    },
  },

  {
    files: ['./src/app/constants/values.ts'],
    rules: {
      'unicorn/no-null': 'off',
    },
  },

  {
    ignores: ['eslint.config.ts', 'webpack.config.ts'],
    rules: {
      'max-lines-per-function': ['error', { max: 40 }],
    },
  },

  {
    rules: {
      'no-console': 'warn',
    },
  },

  eslintPluginPrettierRecommended
);
