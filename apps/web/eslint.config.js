import nextConfig from "@repo/eslint-config/next"
import tailwindCanonicalClasses from "eslint-plugin-tailwind-canonical-classes"
import jsxA11y from "eslint-plugin-jsx-a11y"

export default [
    ...nextConfig,
    jsxA11y.flatConfigs.recommended,
    ...tailwindCanonicalClasses.configs["flat/recommended"],
    {
        rules: {
            "tailwind-canonical-classes/tailwind-canonical-classes": [
                "warn",
                {
                    cssPath: "./app/globals.css",
                },
            ],
        },
    },
]
