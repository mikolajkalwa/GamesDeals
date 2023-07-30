module.exports = {
  "parser": "@typescript-eslint/parser",
  "extends": [
    'eslint:recommended',
    'plugin:@typescript-eslint/strict-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    "prettier"
  ],
  "rules": {
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'] 
  }
}
