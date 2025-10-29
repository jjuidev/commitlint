import { defineConfig, Options } from 'tsup';

import { writeFileSync } from 'fs';

const tsupConfig = defineConfig(() => {
	const base: Options = {
		entry: ['src/index.ts'],
		dts: false,
		clean: true,
		bundle: true,
		external: [
			/^node:/,
			'events',
			'fs',
			'path',
			'child_process',
			'util',

			'husky',
			'lint-staged',

			'@commitlint/cli',
			'@commitlint/config-conventional',

			'prettier',
			'eslint',
			'@eslint/js',
			'globals',
			'typescript-eslint',

			'eslint-config-prettier',
			'eslint-plugin-autofix',
			'eslint-plugin-import',
			'eslint-plugin-prefer-arrow-functions',

			'eslint-plugin-react',
			'eslint-plugin-react-hooks',
			'eslint-plugin-react-native',
			'eslint-plugin-tailwindcss',
			'prettier-plugin-tailwindcss',
			'eslint-plugin-storybook',

			'@next/eslint-plugin-next'
		]
	};

	const cjs: Options = {
		...base,
		platform: 'node',
		target: 'es2020',
		format: 'cjs',
		outDir: 'dist/cjs',
		tsconfig: 'tsconfig.cjs.json',
		onSuccess: async () => {
			writeFileSync('dist/cjs/package.json', JSON.stringify({ type: 'commonjs' }, null, 2));
		}
	};

	const esm: Options = {
		...base,
		platform: 'node',
		target: 'esnext',
		format: 'esm',
		outDir: 'dist/esm',
		tsconfig: 'tsconfig.esm.json',
		onSuccess: async () => {
			writeFileSync('dist/esm/package.json', JSON.stringify({ type: 'module' }, null, 2));
		}
	};

	const types: Options = {
		...base,
		entry: ['src/index.ts'],
		platform: 'node',
		target: 'esnext',
		format: 'esm',
		dts: { only: true },
		outDir: 'dist/types',
		tsconfig: 'tsconfig.types.json'
	};

	const cli: Options = {
		...base,
		entry: ['src/scripts/cli.ts'],
		platform: 'node',
		target: 'es2020',
		format: 'cjs',
		outDir: 'dist/cli',
		banner: {
			js: '#!/usr/bin/env node'
		}
	};

	return [cjs, esm, types, cli];
});

export default tsupConfig;
