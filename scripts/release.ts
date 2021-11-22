import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import simpleGit from 'simple-git';
import mainPackageJson from '../package.json';
import { Logger } from './utils/Logger';
import { getIncrementedVersion } from './release/getIncrementedVersion';
import chalk from 'chalk';
import { updatePackagesVersion } from './release/setPackagesVersion';
import { execa } from 'execa';
import { getPackagesList } from './utils/getPackagesList';
import { publishPackage } from './release/publishPackage';

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
    description: 'Tag [https://dev.to/andywer/how-to-use-npm-tags-4lla]',
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
  const packages = await getPackagesList();

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

  // Build packages
  if (!argv['skip-build']) {
    const startTime = Date.now();
    logger.info(`Building packages ${packages.map((p) => p.name).join(', ')}`);

    await execa('yarn', ['build']);
    logger.success(
      `All packages build successfully in ${chalk.magenta(
        `${((Date.now() - startTime) / 1000).toFixed(2)}s`
      )}`
    );
  }

  // Release packages
  if (!argv['skip-publish']) {
    const startTime = Date.now();
    logger.info('Publishing packages to npm');

    // Publish packages
    await Promise.all(
      packages.map((p) =>
        publishPackage({
          path: p.path,
          name: p.packageJson.name,
          tag: argv.tag,
        })
      )
    );

    logger.success(
      `All packages successfully published in ${chalk.magenta(
        `${((Date.now() - startTime) / 1000).toFixed(2)}s`
      )}`
    );
  }
})();
