module.exports = {
    extends: ["@commitlint/config-conventional"],
    rules: {
        "type-enum": [
            2,
            "always",
            ["feat", "fix", "docs", "style", "refactor", "perf", "test", "ci", "chore", "revert"],
        ],
        "scope-enum": [
            1,
            "always",
            [
                "web",
                "admin",
                "database",
                "ui",
                "types",
                "eslint-config",
                "tailwind-config",
                "e2e",
                "deps",
            ],
        ],
        "scope-empty": [0],
        "body-max-line-length": [0],
        "footer-max-line-length": [0],
    },
}
