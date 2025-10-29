// @ts-nocheck

import pluginJs from '@eslint/js';
import plugAutofix from 'eslint-plugin-autofix';
import pluginImport from 'eslint-plugin-import';
import pluginPreferArrowFunctions from 'eslint-plugin-prefer-arrow-functions';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const loadModule = async (name: string) => {
	try {
		const module = await import(name);

		return module.default || module;
	} catch (err) {
		console.error(`❌ Failed to load module: ${name}`);
		console.error(`   Please install it: npm install --save-dev ${name}`);
		throw err;
	}
};

export const defineEslintConfig = async (...configs: any[]) => {
	const resolvedConfigs = await Promise.all(
		configs.map(async (config) => {
			if (config instanceof Promise) {
				return await config;
			}

			if (Array.isArray(config)) {
				return config;
			}

			return config;
		})
	);

	return defineConfig(...resolvedConfigs.flat());
};

export const eslintConfigNode = defineEslintConfig(
	{
		files: ['**/*.{js,ts,jsx,tsx}'],
		languageOptions: {
			globals: {
				...globals.node,
				...globals.browser
			}
		}
	},

	pluginJs.configs.recommended,
	tseslint.configs.recommended,

	{
		plugins: {
			import: pluginImport,
			'prefer-arrow-functions': pluginPreferArrowFunctions,
			autofix: plugAutofix
		},

		rules: {
			// autofix
			'autofix/eol-last': 'error',
			'autofix/curly': 'error',
			'autofix/no-lonely-if': 'error',
			'autofix/no-else-return': 'error',
			'autofix/object-curly-newline': [
				'error',
				{
					ObjectExpression: {
						multiline: true,
						minProperties: 2,
						consistent: true
					}
				}
			],
			'object-shorthand': 'warn',

			// @typescript-eslint
			'@typescript-eslint/no-unused-vars': 'warn',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-empty-object-type': 'off',

			// eslint-plugin-prefer-arrow-functions
			'prefer-arrow-functions/prefer-arrow-functions': 'error',

			// eslint-plugin-import
			'import/first': 'error',
			'import/newline-after-import': 'error',
			'import/no-duplicates': 'error',
			'import/no-anonymous-default-export': 'error',
			'import/order': [
				'error',
				{
					'newlines-between': 'always',
					alphabetize: {
						order: 'asc',
						caseInsensitive: true
					},
					pathGroups: [
						{
							pattern: '@/**',
							group: 'internal'
						}
					],

					groups: ['builtin', 'external', ['internal', 'parent', 'sibling', 'index'], ['object', 'unknown', 'type']]
				}
			],

			// Others rules
			'padding-line-between-statements': [
				'error',
				{
					blankLine: 'any',
					prev: 'export',
					next: 'export'
				},
				{
					blankLine: 'always',
					prev: ['const', 'let', 'var'],
					next: '*'
				},
				{
					blankLine: 'any',
					prev: ['const', 'let', 'var'],
					next: ['const', 'let', 'var']
				},
				{
					blankLine: 'always',
					prev: '*',
					next: ['function', 'multiline-const', 'multiline-block-like']
				},
				{
					blankLine: 'always',
					prev: ['function', 'multiline-const', 'multiline-block-like'],
					next: '*'
				}
			]
		}
	}
);

export const pluginReact = () => {
	return (async () => {
		const [pluginReact, pluginReactHooks, pluginReactNative] = await Promise.all([
			loadModule('eslint-plugin-react'),
			loadModule('eslint-plugin-react-hooks'),
			loadModule('eslint-plugin-react-native')
		]);

		return defineEslintConfig({
			settings: {
				react: {
					version: 'detect'
				}
			},

			plugins: {
				react: pluginReact,
				'react-native': pluginReactNative,
				'react-hooks': pluginReactHooks
			},

			rules: {
				// eslint-plugin-react
				'react/jsx-uses-react': 'off',
				'react/react-in-jsx-scope': 'off',
				'react/display-name': 'off',

				'react/jsx-boolean-value': 'error',
				'react/jsx-curly-brace-presence': ['error', 'never'],
				'react/self-closing-comp': 'error',

				// eslint-plugin-react-native
				'react-native/no-unused-styles': 'warn',
				'react-native/no-inline-styles': 'warn',
				'react-native/no-color-literals': 'warn',
				'react-native/no-raw-text': 'off',

				// eslint-plugin-react-hooks
				'react-hooks/rules-of-hooks': 'error',
				'react-hooks/exhaustive-deps': 'warn'
			}
		});
	})();
};

export const pluginNext = () => {
	return (async () => {
		const pluginNext = await loadModule('@next/eslint-plugin-next');

		return defineEslintConfig(pluginReact(), {
			plugins: {
				'@next/next': pluginNext
			},

			rules: {
				// eslint-plugin-next
				...pluginNext.configs.recommended.rules,
				...pluginNext.configs['core-web-vitals'].rules
			}
		});
	})();
};

export const pluginStorybook = () => {
	return (async () => {
		const pluginStorybook = await loadModule('eslint-plugin-storybook');

		return [
			{
				plugins: {
					storybook: pluginStorybook
				},

				rules: {
					// eslint-plugin-storybook
					...pluginStorybook.configs.recommended.rules
				}
			}
		];
	})();
};

export default eslintConfigNode;
