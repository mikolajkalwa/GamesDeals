module.exports = {
  "parser": "@typescript-eslint/parser",
  "extends": [
    "airbnb-base",
    "airbnb-typescript/base",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
  "rules": {
    "no-console": 0,
    "linebreak-style": 0,
    "max-len": 0,
    "no-return-await": 0,
    "import/prefer-default-export": 0,
    "@typescript-eslint/lines-between-class-members": 0,
    "@typescript-eslint/return-await": [
      "error",
      "always"
    ]
  }
}
