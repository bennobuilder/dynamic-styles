import { Logger } from '../utils/Logger';
import { execa } from 'execa';
import chalk from 'chalk';

const logger = new Logger('publish-package');

function getPackagePublishArguments(config: PkgPublish) {
  const args = ['publish'];

  if (config.contents != null) {
    args.push(config.contents);
  }

  if (config.tag != null) {
    args.push('--tag', config.tag);
  }

  if (config.registry != null) {
    args.push('--registry', config.registry);
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
export async function publishPackage(
  config: PublishPackageConfig
): Promise<boolean> {
  const { path, name, tag, registry = 'https://registry.npmjs.org' } = config;

  try {
    // Publish package
    await pkgPublish('npm', {
      contents: path,
      tag,
      registry: registry,
    });

    logger.info(`Package ${chalk.cyan(name)} was published`);

    return true;
  } catch (e: any) {
    logger.error(`Failed to publish package ${chalk.red(name)}`, 2);
    logger.write(chalk.red`${e?.message}\n`);
  }

  return false;
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
  /**
   * Registry to publish the package at.
   *
   * @default 'https://registry.npmjs.org'
   */
  registry?: string;
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
  /**
   * Registry to publish the package at.
   */
  registry?: string;
};
