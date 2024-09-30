module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended' // 添加这一行
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error' // 使 Prettier 的规则成为 ESLint 错误
  }
}
