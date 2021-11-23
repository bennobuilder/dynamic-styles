import { Logger } from '../utils/Logger';
import { execa } from 'execa';
import chalk from 'chalk';

const logger = new Logger('publish-package');

async function checkLogin(externalRegistry: string) {
  const args = ['whoami'];

  if (externalRegistry) {
    args.push('--registry', externalRegistry);
  }

  try {
    const { stdout } = await execa('npm', args);
    logger.info(`Logged in as user: '${stdout}'`);
  } catch (e: any) {
    logger.error('You must be logged in. Use `npm login` and try again.', 2);
    logger.write(chalk.red`${e?.message}\n`);
  }
}

function getPackagePublishArguments(config: PkgPublish) {
  const args = ['publish'];

  if (config.contents != null) {
    args.push(config.contents);
  }

  if (config.tag != null) {
    args.push('--tag', config.tag);
  }

  return args;
}

function pkgPublish(pkgManager: 'npm' | 'yarn', config: PkgPublish) {
  return execa(pkgManager, getPackagePublishArguments(config));
}

/**
 * Publishes the specified packages to npm.
 *
 * @param config - Configuration object
 */
export async function publishPackage(config: PublishPackageConfig) {
  const { path, name, tag } = config;
  try {
    await checkLogin('https://registry.npmjs.org/');
    await pkgPublish('npm', { contents: path, tag });
    logger.success(`Package ${chalk.cyan(name)} was published`);
  } catch (e: any) {
    logger.error(`Failed to publish package ${chalk.red(name)}`, 2);
    logger.write(chalk.red`${e?.message}\n`);
    process.exit(1);
  }
}

type PublishPackageConfig = {
  /**
   * Path to the package to be published.
   */
  path: string;
  /**
   * Name of the package to be published.
   */
  name: string;
  /**
   * Publish under a given dist-tag
   *
   * [Learn more..](https://classic.yarnpkg.com/en/docs/cli/publish#toc-yarn-publish-tag)
   */
  tag: string;
};

type PkgPublish = {
  /**
   * Subdirectory to publish.
   */
  contents?: string;
  /**
   * Publish under a given dist-tag.
   */
  tag?: string;
};
