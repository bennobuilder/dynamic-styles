import { execa } from 'execa';
import chalk from 'chalk';
import { Logger } from '../utils/Logger';

const logger = new Logger('check-auth');

export async function checkAuth(registry: string): Promise<false | string> {
  const args = ['whoami'];

  if (registry) {
    args.push('--registry', registry);
  }

  try {
    const { stdout } = await execa('npm', args);
    logger.info(`Logged in as user: '${stdout}'`);
    return stdout;
  } catch (e: any) {
    logger.error('You must be logged in. Use `npm login` and try again.', 2);
    logger.write(chalk.red`${e?.message}\n`);
  }

  return false;
}
