/** @format */

import { genSaltSync, hashSync } from 'bcrypt';

const encryptPassword = async (password: string): Promise<string> => {
  const newPassword = hashSync(password, genSaltSync(10));
  return newPassword;
};

export default encryptPassword;
