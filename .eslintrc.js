module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
    ],
    extends: [
        'airbnb-typescript/base',
    ],
    parserOptions: {
        project: './tsconfig.json'
    },
    rules: {
        "linebreak-style": 0,
        "no-console": 0
    }
};