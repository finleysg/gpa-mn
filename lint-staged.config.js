export default {
	"apps/web/**/*.{ts,tsx,js,jsx}": (filenames) => [
		`pnpm --filter web exec eslint --fix ${filenames.join(" ")}`,
		`prettier --write ${filenames.join(" ")}`,
	],

	"apps/admin/**/*.{ts,tsx,js,jsx}": (filenames) => [
		`pnpm --filter admin exec eslint --fix ${filenames.join(" ")}`,
		`prettier --write ${filenames.join(" ")}`,
	],

	"packages/ui/**/*.{ts,tsx,js,jsx}": (filenames) => [
		`pnpm --filter @repo/ui exec eslint --fix ${filenames.join(" ")}`,
		`prettier --write ${filenames.join(" ")}`,
	],

	"*.{json,md,yml,yaml,css}": ["prettier --write"],
}
