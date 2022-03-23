import dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

const {
  PORT = 3000,
  DATABASE_URL
} = process.env;

if (!DATABASE_URL) {
  throw Error('DATABASE_URL missing in env file');
}

export { PORT, DATABASE_URL };