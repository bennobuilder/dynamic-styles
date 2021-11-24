import path from 'path';
import fs from 'fs-extra';
import { getRootPkgJsonDir } from './getRootPkgJsonDir';

interface PackageJson {
  readonly name: string;
  readonly version: string;
  readonly description: string;
  readonly licence: string;
  readonly homepage?: string;
  readonly author: string;
  readonly keywords?: string;
  readonly main: string;
  readonly module?: string;
  readonly types?: string;
  readonly scripts?: Record<string, string>;
  readonly dependencies?: Record<string, string>;
  readonly peerDependencies?: Record<string, string>;
  readonly devDependencies?: Record<string, string>;
  readonly files?: string[];
  readonly sideEffects?: boolean;
}

export interface Package {
  name: string;
  path: string;
  packageJsonPath: string;
  packageJson: PackageJson;
}

export async function getPackagesList() {
  const rootPath = await getRootPkgJsonDir();
  const packagesPath = path.join(rootPath, '/packages');
  const packageNames = await fs.readdir(packagesPath);
  const packages: Package[] = [];

  for (const packageName of packageNames) {
    const packagePath = path.join(packagesPath, packageName);
    const packageJsonPath = path.join(packagePath, '/package.json');
    if (await fs.pathExists(packageJsonPath)) {
      packages.push({
        name: packageName,
        path: packagePath,
        packageJsonPath,
        packageJson: await fs.readJSON(packageJsonPath),
      });
    }
  }

  return packages;
}
