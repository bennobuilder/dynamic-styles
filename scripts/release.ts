import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import simpleGit from 'simple-git';
import githubRelease from 'new-github-release-url';
import open from 'open';
import { Logger } from './utils/Logger';
import { getIncrementedVersion } from './release/getIncrementedVersion';
import chalk from 'chalk';
import { updatePackagesVersion } from './release/setPackagesVersion';
import { execa } from 'execa';
import { getPackagesList } from './utils/getPackagesList';
import { publishPackage } from './release/publishPackage';

import mainPackageJson from '../package.json';
import { checkAuth } from './release/checkAuth';

// NOTE: this whole process can also be done by simply using 'np' (https://github.com/sindresorhus/np)

const logger = new Logger('release');
const git = simpleGit();
const publishBranches = ['master'];

const { argv } = yargs(hideBin(process.argv))
  .option('stage', {
    type: 'string',
    choices: ['alpha', 'beta'],
    description: "Prerelease stage: 'alpha', 'beta'",
  })
  .option('tag', {
    type: 'string',
    default: 'latest',
    description: 'Publish under a given dist-tag.',
  })
  .option('skip-master-check', {
    type: 'boolean',
    default: false,
    description: "Whether to skip the check if you are on the 'master' branch.",
  })
  .option('skip-version-check', {
    type: 'boolean',
    default: false,
    description: 'Whether to skip incrementing the version of all packages.',
  })
  .option('skip-build', {
    type: 'boolean',
    default: false,
    description: 'Whether to skip building all packages.',
  })
  .option('skip-publish', {
    type: 'boolean',
    default: false,
    description: 'Whether to skip publishing all packages.',
  })
  .example([
    ['$0 minor --skip-build', 'Release but skip building packages.'],
    ['$0 minor --alpha', 'Prerelease to alpha stage.'],
  ]);

// Async wrapper method to use the modern 'await'
(async () => {
  const packages = await getPackagesList();
  const status = await git.status();

  logger.info(
    `Releasing all packages: ${packages
      .map((p) => chalk.gray(p.name))
      .join(', ')}`
  );

  // Check if you are on the 'master' branch
  if (!publishBranches.includes(status.current || '')) {
    if (!argv['skip-master-check']) {
      logger.error(
        `Rejected: You are not on a valid release branch! Valid release branches: ${chalk.magenta(
          publishBranches.join(', ')
        )}`
      );
      process.exit(1);
    } else {
      logger.warn(
        `Note: You are not on a valid release branch! Valid release branches: ${chalk.magenta(
          publishBranches.join(', ')
        )}`
      );
    }
  }

  // Increment package versions
  let packageVersion = mainPackageJson.version;
  if (!argv['skip-version-check']) {
    // Get new version
    packageVersion =
      getIncrementedVersion(packageVersion, {
        type: argv._[0] as any,
        stage: argv.stage as any,
      }) || packageVersion;
    if (packageVersion == null) process.exit(1);

    logger.info(`New version: ${chalk.cyan(packageVersion)}`);

    // Update Package versions
    if (!(await updatePackagesVersion(packageVersion))) process.exit(1);
  }

  // Build packages
  if (!argv['skip-build']) {
    const startTime = Date.now();
    logger.info(`Building packages`);

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
    const registry = 'https://registry.npmjs.org/';
    logger.info('Publishing packages to npm');

    // Check Auth Status
    if (!(await checkAuth(registry))) return;

    // Publish packages
    await Promise.all(
      packages.map((p) =>
        publishPackage({
          path: p.path,
          name: p.packageJson.name,
          tag: argv.tag,
          registry,
        })
      )
    );

    logger.success(
      `All packages successfully published in ${chalk.magenta(
        `${((Date.now() - startTime) / 1000).toFixed(2)}s`
      )}`
    );
  }

  // Push release changes to Git
  await git.commit(`[release] Version: ${packageVersion}`);
  await git.push();

  // Open Github release
  open(
    githubRelease({
      user: 'bennodev19',
      repo: 'dynamic-styles',
      tag: packageVersion,
      title: packageVersion,
    })
  );
})();
