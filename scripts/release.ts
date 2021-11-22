import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import simpleGit from 'simple-git';
import mainPackageJson from '../package.json';
import { Logger } from './Logger';
import { getIncrementedVersion } from './release/getIncrementedVersion';
import chalk from 'chalk';
import { updatePackagesVersion } from './release/setPackagesVersion';

const logger = new Logger('release');
const git = simpleGit();

const { argv } = yargs(hideBin(process.argv))
  .option('stage', {
    type: 'string',
    choices: ['alpha', 'beta'],
    description: "Prerelease stage: 'alpha', 'beta'",
  })
  .option('tag', {
    type: 'string',
    default: 'latest',
    description: 'Tag',
  })
  .option('skip-version-check', {
    type: 'boolean',
    default: false,
    description: 'Whether to skip checking version.',
  })
  .option('skip-build', {
    type: 'boolean',
    default: false,
    description: 'Whether to skip building step.',
  })
  .option('skip-publish', {
    type: 'boolean',
    default: false,
    description: 'Whether to skip publishing step.',
  })
  .example([
    ['$0 minor --skip-build', 'Release but skip building packages.'],
    ['$0 minor --alpha', 'Prerelease to alpha stage.'],
  ]);

// Async wrapper method to use 'await'
(async () => {
  const status = await git.status();

  logger.info('Releasing all packages');

  // Increment Version
  let packageVersion = mainPackageJson.version;
  if (!argv.skipVersionCheck) {
    packageVersion =
      getIncrementedVersion(packageVersion, {
        type: argv._[0] as any,
        stage: argv.stage as any,
      }) || packageVersion;
    logger.info(`New version: ${chalk.cyan(packageVersion)}`);

    await updatePackagesVersion(packageVersion);
  }

  // console.log({ status, incrementedVersion });
})();
