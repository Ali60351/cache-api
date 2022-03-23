import dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

const { DATABASE_URL } = process.env;

const PORT = Number(process.env.PORT || 3000);
const CACHE_LIFE_SPAN = Number(process.env.CACHE_LIFE_SPAN || 60);

if (!DATABASE_URL) {
  throw Error('DATABASE_URL missing in env file');
}

export {
  PORT, DATABASE_URL, CACHE_LIFE_SPAN
};