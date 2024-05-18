import * as crypto from 'crypto';

export const hashPassword = (password: string, salt: string) => {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
};

export const comparePassword = (
  enteredPassword: string,
  salt: string,
  storePassword: string,
) => {
  return (
    crypto
      .pbkdf2Sync(enteredPassword, salt, 1000, 64, `sha512`)
      .toString(`hex`) === storePassword
  );
};
