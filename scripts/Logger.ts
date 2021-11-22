import chalk from 'chalk';

export class Logger {
  public readonly key: string;

  constructor(key: string) {
    this.key = key;
  }

  public log(message: string, lineBreakCount = 1) {
    // https://stackoverflow.com/questions/4976466/difference-between-process-stdout-write-and-console-log-in-node-js
    process.stdout.write(
      `${chalk.cyan(`[${this.key}]`)} ${message}${'\n'.repeat(lineBreakCount)}`
    );
  }

  info(message: string, lineBreakCount = 1) {
    this.log(`${chalk.magenta('→')} ${chalk.white(message)}`, lineBreakCount);
  }

  success(message: string, lineBreakCount = 1) {
    this.log(`✅  ${chalk.green(message)}`, lineBreakCount);
  }

  error(message: string, lineBreakCount = 1) {
    this.log(`❌  ${chalk.red(message)}`, lineBreakCount);
  }
}
