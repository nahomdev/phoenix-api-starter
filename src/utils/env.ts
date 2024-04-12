import dotenv from 'dotenv';

dotenv.config();

const env: { [key: string]: string | undefined } = {};

Object.keys(process.env).forEach((key) => {
  env[key] = process.env[key];
});

export default env;