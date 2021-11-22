import path from 'path';
import fs from 'fs-extra';
import { Logger } from '../Logger';

const logger = new Logger('write-version');

/**
 * Retrieves the path to the root 'package.json'.
 *
 * https://stackoverflow.com/questions/10265798/determine-project-root-from-a-running-node-js-application
 */
async function getRootPkgJsonDir() {
  const nodeModulesPaths = module.paths;
  for (const nodeModulePath of nodeModulesPaths) {
    try {
      const prospectivePkgJsonDir = path.dirname(nodeModulePath);
      await fs.access(nodeModulePath, fs.constants.F_OK);
      return prospectivePkgJsonDir;
    } catch (e) {
      // do nothing
    }
  }
  return null;
}

/**
 * Write specified version to the 'package.json' at provided file path.
 *
 * @param filePath - File Path to the 'package.json'.
 * @param version - Version to be written.
 */
async function writeVersionToPkgJson(filePath: string, version: string) {
  const current = await fs.readJSON(filePath);
  current.version = version;
  await fs.writeJSON(filePath, current, { spaces: 2 });
}

/**
 * Update specified version in all relevant 'package.json' files.
 *
 * @param version - Version to be set.
 */
export async function updatePackagesVersion(version: string) {
  const rootPath = await getRootPkgJsonDir();

  if (rootPath == null) {
    logger.error('Failed to retrieve root path.');
    return;
  }

  // Update version in root 'package.json'
  await writeVersionToPkgJson(path.join(rootPath, '/package.json'), version);

  // Update version in 'package.json' of all packages in 'src'
  const src = path.join(rootPath, '/packages');
  const packages = (await fs.readdir(src)).filter((folder) => {
    return fs.pathExistsSync(path.join(src, folder, '/package.json'));
  });
  await Promise.all(
    packages.map((folder) =>
      writeVersionToPkgJson(path.join(src, folder, '/package.json'), version)
    )
  );
}
