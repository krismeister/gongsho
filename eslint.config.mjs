import prettier from 'eslint-plugin-prettier';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [{
  files: ['**/*.{js,jsx,ts,tsx}'],
  ignores: ['project/**', 'node_modules/**', 'dist/**', 'build/**'],
  plugins: {
    '@typescript-eslint': tseslint,
    'prettier': prettier
  },
  languageOptions: {
    parser: tsparser,
    ecmaVersion: 'latest',
  },
  rules: {
    ...tseslint.configs['recommended'].rules,
    'prettier/prettier': 'error',
  }
}];