import { Logger } from '../Logger';
import chalk from 'chalk';

const logger = new Logger('increment-version');

const VERSION_INCREMENT = ['patch', 'minor', 'major'] as const;
const VERSION_STAGE = ['alpha', 'beta', 'rc'] as const;

/**
 * Increments the specified version based on the provided increment type.
 *
 * @param version - Version to be incremented.
 * @param type - In what way to increment the specified version.
 */
const updateVersion = (
  version: StrictVersionType,
  type: VersionIncrement
): StrictVersionType | null => {
  const splittedVersion = version.split('.');

  // Error if version doesn't follow the common version pattern (e.g. 1.0.1)
  if (splittedVersion.length !== 3) {
    logger.error(
      `Provided version '${version}' doesn't follow a valid version pattern (e.g. 1.0.1).`
    );
    return null;
  }

  switch (type) {
    case 'patch':
      splittedVersion[2] = (parseInt(splittedVersion[2], 10) + 1).toString();
      break;

    case 'minor':
      splittedVersion[1] = (parseInt(splittedVersion[1], 10) + 1).toString();
      splittedVersion[2] = '0';
      break;

    case 'major':
      splittedVersion[0] = (parseInt(splittedVersion[0], 10) + 1).toString();
      splittedVersion[1] = '0';
      splittedVersion[2] = '0';
      break;
  }

  return splittedVersion.join('.') as any;
};

/**
 * Updates the specified stage based on the provided stage type.
 *
 * @param stage - Stage to be updated.
 * @param type - Stage type to be set or updated.
 */
const updateStage = (
  stage: StagedVersionType | null,
  type: VersionStage
): StagedVersionType => {
  if (stage == null) return `${type}.0`;
  const [stageName, stageVersion] = stage.split('.');
  if (stageName !== type) return `${type}.0`;
  return `${stageName}.${parseInt(stageVersion, 10) + 1}`;
};

/**
 * Increments the specified version.
 *
 * @param version - Version to be incremented.
 * @param config - Configuration object
 */
export function getIncrementedVersion(
  version: VersionType | string,
  config: GetIncrementedVersionConfig
) {
  const type = config.type || 'patch';
  const stage = config.stage || null;

  // Validate type
  if (!VERSION_INCREMENT.includes(type)) {
    logger.error(`Invalid version type '${chalk.cyan(config.type)}' provided, 
    it should be one of these values: ${VERSION_INCREMENT.join(', ')}`);

    process.exit(1);
  }

  // Validate stage
  if (stage != null && !VERSION_STAGE.includes(stage)) {
    logger.error(`Invalid version stage '${chalk.cyan(stage)}' provided, 
    it should be one of these values: ${VERSION_STAGE.join(', ')}`);

    process.exit(1);
  }

  // Increment Version
  try {
    const [parsedVersion, parsedStage] = version.split('-');

    // Entering Prerelease (e.g. '1.9.4' -> '2.0.0-alpha.0')
    if (parsedStage == null && stage != null) {
      return `${updateVersion(parsedVersion as any, type)}-${updateStage(
        parsedStage,
        stage
      )}`;
    }

    // Exiting Prerelease (e.g. '2.0.2-alpha.17' -> '2.0.0')
    if (parsedStage != null && stage == null) {
      return parsedVersion;
    }

    // Normal Release (e.g. '2.0.0' -> '2.0.1')
    if (parsedStage == null && stage == null) {
      return updateVersion(parsedVersion as any, type);
    }

    // Prerelease (e.g. '2.0.0-alpha.22' -> '2.0.0-alpha.23')
    if (parsedStage != null && stage != null) {
      return `${parsedVersion}-${updateStage(parsedStage as any, stage)}`;
    }
  } catch (e) {
    logger.error(`Failed to parse specified version: '${version}'!`);
  }

  return null;
}

type GetIncrementedVersionConfig = {
  /**
   * In what way to increment the specified version.
   * @default 'patch'
   */
  type?: VersionIncrement;
  /**
   * Stage to be applied to the specified version.
   * @default null
   */
  stage?: VersionStage;
};

type VersionIncrement = typeof VERSION_INCREMENT[number];
type VersionStage = typeof VERSION_STAGE[number];
type StrictVersionType = `${number}.${number}.${number}`; // e.g. '2.0.0'
type StagedVersionType = `${VersionStage}.${number}`; // e.g. 'alpha.0'
type VersionType =
  | StrictVersionType
  | `${StrictVersionType}-${StagedVersionType}`; // e.g. '2.0.0-alpha.0'
