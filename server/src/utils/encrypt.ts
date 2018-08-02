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

export function passwordEncrypt(pwd: string): string {
  return md5(`${md5(pwd)}s8nQkZ2l`);
}
