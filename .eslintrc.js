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
        'linebreak-style': 0,
        'no-console': 0,
        '@typescript-eslint/member-delimiter-style': ['error', {
            'multiline': {
                'delimiter': 'semi',
                'requireLast': true
            },
            'singleline': {
                'delimiter': 'semi',
                'requireLast': true
            }
        }]
    }
};