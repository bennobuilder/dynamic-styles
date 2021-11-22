import { Logger } from '../utils/Logger';
import { execa } from 'execa';
import chalk from 'chalk';

const logger = new Logger('publish-package');

/**
 * Publishes the specified packages to npm.
 *
 * @param config - Configuration object
 */
export async function publishPackage(config: PublishPackageConfig) {
  const { path, name, tag } = config;
  try {
    await execa('yarn', ['publish', path, '--tag', tag]);
    logger.success(`Package ${chalk.cyan(name)} was published`);
  } catch (e: any) {
    logger.error(`Failed to publish package ${chalk.red(name)}`);
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
   * Providing a tag to yarn publish lets you publish packages with a specific tag.
   * For example, if you do a yarn publish --tag beta,
   * and your package is named blorp, then someone else can install that package with yarn add blorp@beta.
   *
   * [Learn more..](https://classic.yarnpkg.com/en/docs/cli/publish#toc-yarn-publish-tag)
   */
  tag: string;
};
