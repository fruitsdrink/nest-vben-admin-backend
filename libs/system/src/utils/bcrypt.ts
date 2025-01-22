import bcryptjs from 'bcryptjs';

const salt = 12;

export const hashPassword = (text: string) => {
  return bcryptjs.hashSync(text, salt);
};

export const comparePassword = (text: string, hash: string) => {
  return bcryptjs.compareSync(text, hash);
};
