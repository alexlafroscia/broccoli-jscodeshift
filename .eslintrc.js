module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  plugins: [
    'node',
    'prettier'
  ],
  extends: [
    'eslint:recommended',
    'prettier'
  ],
  env: {
    node: true
  },
  rules: {
    'prettier/prettier': ['error', {
      singleQuote: true
    }]
  }
};
