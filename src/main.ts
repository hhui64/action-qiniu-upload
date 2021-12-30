import * as core from '@actions/core';
import { genToken } from './token';
import { upload } from './upload';

async function run(): Promise<void> {
  try {
    const ak = core.getInput('access_key');
    const sk = core.getInput('secret_key');
    const bucket = core.getInput('bucket');
    const sourceDir = core.getInput('source_dir');
    const exclude = core.getInput('exclude');
    const destDir = core.getInput('dest_dir');
    const overflow = core.getInput('overflow') === 'true';
    const ignoreSourceMap = core.getInput('ignore_source_map') === 'true';

    const token = genToken(bucket, ak, sk);
    let excludes = [] as string[];

    if (exclude) {
      excludes = exclude.split(',').map((value) => value.trim());
    }

    upload(
      token,
      bucket,
      ak,
      sk,
      overflow,
      sourceDir,
      destDir,
      excludes,
      ignoreSourceMap,
      (file, key) => core.info(`Success: ${file} => [${bucket}]: ${key}`),
      () => core.info('Done!'),
      (error) => core.setFailed(error.message),
    );
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
