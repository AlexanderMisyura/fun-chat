import type { Configuration } from 'lint-staged';

const lintStagedConfig: Configuration = {
  '**/*.json': (stagedFiles) => `prettier --check ${stagedFiles.join(' ')}`,

  '**/*.scss': (stagedFiles) => `stylelint ${stagedFiles.join(' ')}`,

  '**/*.ts': (stagedFiles) => [
    `prettier --check ${stagedFiles.join(' ')}`,
    `eslint ${stagedFiles.join(' ')}`,
  ],
  '*': () => 'echo "Fallback. No linting required"',
};

export default lintStagedConfig;
