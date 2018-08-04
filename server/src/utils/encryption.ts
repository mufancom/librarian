import * as bcrypt from 'bcrypt';

export async function encryptPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(data: string, encrypted: string) {
  return bcrypt.compare(data, encrypted);
}
