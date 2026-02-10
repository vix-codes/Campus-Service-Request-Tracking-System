import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'


// Flat config without relying on `eslint/config` (not available in ESLint v8).
export default [
  // Ignore build output and Vercel serverless functions (Node runtime).
  { ignores: ['dist', 'api'] },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      ...(reactHooks.configs.recommended?.rules || {}),
      ...(reactRefresh.configs.vite?.rules || {}),
      // Allow exporting hooks/context alongside components in Vite projects.
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
]
