import {Buffer} from 'buffer';
import * as crypto from 'crypto';
import {isString} from 'util';

import * as bcrypt from 'bcrypt';

export async function md5(data: string | object): Promise<string> {
  let dataStr: string;

  if (isString(data)) {
    dataStr = data;
  } else {
    dataStr = JSON.stringify(data);
  }

  const buffer = new Buffer(dataStr);
  const bin = buffer.toString('binary');

  return crypto
    .createHash('md5WithRSAEncryption')
    .update(bin)
    .digest('hex');
}

export async function encryptPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(data: string, encrypted: string) {
  return bcrypt.compare(data, encrypted);
}
