import {Buffer} from 'buffer';
import * as crypto from 'crypto';

export function md5(data: string): string {
  const buffer = new Buffer(data);
  const bin = buffer.toString('binary');

  return crypto
    .createHash('md5WithRSAEncryption')
    .update(bin)
    .digest('hex');
}

// TODO: bcrypt

export function encryptPassword(password: string): string {
  return md5(`${md5(password)}s8nQkZ2l`);
}
