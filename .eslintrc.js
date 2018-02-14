module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-console": 0,
        "spaced-comment": ["error", "always", {
            "line": {
                "markers": ["/"],
                "exceptions": ["-", "+"]
            },
            "block": {
                "markers": ["!"],
                "exceptions": ["*"],
                "balanced": true
            }
        }]
    }
};