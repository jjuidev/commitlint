import { existsSync, writeFileSync } from 'fs';
import { join } from 'path';

import consola from 'consola';
import pc from 'picocolors';

const commitlintConfigTemplate = `const { commitlintConfigRecommend } = require('@jjuidev/node-devtools');

module.exports = commitlintConfigRecommend;
`;

export const setupCommitlint = () => {
	consola.start('Setting up Commitlint...');

	const commitlintrcPath = join(process.cwd(), '.commitlintrc.cjs');

	if (existsSync(commitlintrcPath)) {
		consola.info('Overwriting existing .commitlintrc.cjs');
	}

	writeFileSync(commitlintrcPath, commitlintConfigTemplate, 'utf8');
	consola.success(`Created ${pc.cyan('.commitlintrc.cjs')}\n`);
};
