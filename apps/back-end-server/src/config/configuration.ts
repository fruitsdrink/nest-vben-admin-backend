import { Configuration } from '@/types';
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const YAML_CONFIG_FILENAME = 'config.yaml';
console.log(__dirname);
export default () => {
  return yaml.load(
    readFileSync(join(__dirname, 'config', YAML_CONFIG_FILENAME), 'utf8'),
  ) as Configuration;
};
