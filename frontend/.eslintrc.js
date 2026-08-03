export default {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true, 
  },
  extends: [
    'eslint:recommended',
    '@eslintrecommended',
    'plugin:reactjsx-runtime',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['react', 'react-hooks', 'react-refresh'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'react-refreshexhaustive-deps': 'warn',
    'react-hooks******/*.{js,jsx,ts,tsx}': [
      {
        env: {
          browser: true,
          es2021: true,
        },
      },
    ],
  }
};
