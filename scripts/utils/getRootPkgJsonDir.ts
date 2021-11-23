import path from 'path';
import fs from 'fs-extra';
import { Logger } from './Logger';

const logger = new Logger('get-root-pkg-json-dir');

export const { getRootPkgJsonDir } = (() => {
  let prospectivePkgJsonDir: string | null = null;

  /**
   * Retrieves the path to the root 'package.json'.
   *
   * https://stackoverflow.com/questions/10265798/determine-project-root-from-a-running-node-js-application
   */
  async function getRootPkgJsonDir(reset = false) {
    if (prospectivePkgJsonDir != null && !reset) return prospectivePkgJsonDir;

    // Retrieve path to root 'node_modules' and thus 'package.json'
    const nodeModulesPaths = module.paths;
    for (const nodeModulePath of nodeModulesPaths) {
      try {
        prospectivePkgJsonDir = path.dirname(nodeModulePath);
        await fs.access(nodeModulePath, fs.constants.F_OK);
        return prospectivePkgJsonDir;
      } catch (e) {
        // do nothing
      }
    }

    logger.error('Failed to retrieve root path.');
    return 'not_found';
  }

  return { getRootPkgJsonDir };
})();
