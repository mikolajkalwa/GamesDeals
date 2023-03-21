module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
    ],
    extends: [
        "airbnb-base",
        "airbnb-typescript/base",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking"
    ],
    parserOptions: {
        project: './tsconfig.json'
    },
    rules: {
        "import/prefer-default-export": 0,
        "@typescript-eslint/lines-between-class-members": 0,
        "no-console": 0,
        "linebreak-style": 0,
        "max-len": 0,
        "no-return-await": 0,
        "@typescript-eslint/return-await": [
          "error",
          "always"
        ]
    }
};
