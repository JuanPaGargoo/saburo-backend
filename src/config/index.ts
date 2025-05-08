import dotenv from 'dotenv';
dotenv.config();

import { config as developmentConfig } from './development';

const env = process.env.NODE_ENV || 'development';

const configs: { [key: string]: { PORT: string | number; DATABASE_URL: string } } = {
  development: developmentConfig,
  // Puedes agregar más configuraciones para otros entornos aquí
};

export default configs[env];