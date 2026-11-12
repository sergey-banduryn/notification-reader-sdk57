const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const js = require('@eslint/js');
const stylistic = require('@stylistic/eslint-plugin');
const importPlugin = require('eslint-plugin-import');
const perfectionist = require('eslint-plugin-perfectionist');
const reactPlugin = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const tseslint = require('typescript-eslint');

const tsConfig = defineConfig({
  extends: [
    tseslint.configs.strictTypeChecked,
    tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    ecmaVersion: 'latest',
    parser: tseslint.parser,
    parserOptions: {
      projectService: true,
    },
  },
  name: 'ts',
  rules: {
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    '@typescript-eslint/consistent-type-exports': [
      'error',
      {
        fixMixedExportsWithInlineTypeSpecifier: true,
      },
    ],
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        fixStyle: 'inline-type-imports',
        prefer: 'type-imports',
      },
    ],
    '@typescript-eslint/no-import-type-side-effects': 'error',
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/non-nullable-type-assertion-style': 'off',
  },
});

const jsConfig = defineConfig({
  extends: [js.configs.recommended],
  name: 'js',
  rules: {
    curly: ['error', 'all'],
    eqeqeq: ['error', 'always'],
    'no-console': ['error'],
    'no-restricted-syntax': [
      'error',
      {
        message:
          'Please use a single export at the bottom of the file instead of inline exports.',
        selector: 'ExportNamedDeclaration[declaration!=null]',
      },
      {
        message: 'Export/Import all (*) is forbidden.',
        selector: 'ExportAllDeclaration,ImportAllDeclaration',
      },
      {
        message: 'Please combine all exports into a single export statement.',
        selector:
          'Program > ExportNamedDeclaration[source=null] ~ ExportNamedDeclaration[source=null]',
      },
      {
        message:
          "Colors must be specified in 6 uppercase HEX formats (eg '#FFFFFF').",
        selector:
          'Literal[value=/^#(?:[0-9a-fA-F]{3}|[0-9a-f]{6}|[0-9a-fA-F]{8})$/][value!=/^#[0-9A-F]{6}$/]',
      },
    ],
    'no-unused-vars': 'warn',
    'prefer-destructuring': ['error'],
    quotes: ['error', 'single', { avoidEscape: true }],
  },
});

const reactConfig = defineConfig({
  name: 'react',
  plugins: {
    react: reactPlugin,
    'react-hooks': reactHooks,
  },
  rules: {
    ...reactPlugin.configs.recommended.rules,
    ...reactPlugin.configs['jsx-runtime'].rules,
    ...reactHooks.configs.recommended.rules,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
});

const perfectionistConfig = defineConfig({
  extends: [perfectionist.configs['recommended-natural']],
  name: 'perfectionist',
  rules: {
    'perfectionist/sort-imports': 'off',
  },
});

const importPluginConfig = defineConfig({
  extends: [
    importPlugin.flatConfigs.recommended,
    importPlugin.flatConfigs.typescript,
  ],
  name: 'importPlugin',
  rules: {
    'import/exports-last': ['error'],
    'import/extensions': [
      'error',
      {
        json: 'always',
      },
    ],
    'import/newline-after-import': ['error'],
    'import/no-commonjs': 'warn',
    'import/no-default-export': ['error'],
    'import/no-duplicates': ['error'],
    'import/no-unused-modules': 'warn',
  },
  settings: {
    'import/resolver': {
      node: true,
      typescript: true,
    },
  },
});

const stylisticConfig = defineConfig({
  name: 'stylistic',
  plugins: {
    '@stylistic': stylistic,
  },
  rules: {
    '@stylistic/padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        next: [
          'block-like',
          'class',
          'do',
          'for',
          'function',
          'if',
          'switch',
          'try',
          'while',
        ],
        prev: '*',
      },
      {
        blankLine: 'always',
        next: '*',
        prev: [
          'block-like',
          'class',
          'do',
          'for',
          'function',
          'if',
          'switch',
          'try',
          'while',
        ],
      },
      { blankLine: 'always', next: 'return', prev: '*' },
      { blankLine: 'always', next: '*', prev: 'return' },
      {
        blankLine: 'any',
        next: ['const', 'let', 'var'],
        prev: ['const', 'let', 'var'],
      },
      { blankLine: 'always', next: 'export', prev: '*' },
      { blankLine: 'never', next: 'export', prev: 'export' },
    ],
  },
});

module.exports = defineConfig({
  extends: [
    expoConfig,
    tsConfig,
    jsConfig,
    reactConfig,
    importPluginConfig,
    stylisticConfig,
    perfectionistConfig,
    {
      files: ['src/app/**/*.{ts,tsx}'],
      rules: {
        'import/no-default-export': 'off',
      },
    },
  ],
  files: ['src/**/*.{ts,tsx}'],
});
