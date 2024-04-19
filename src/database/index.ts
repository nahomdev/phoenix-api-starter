import knex, { Knex } from 'knex';
import config from './dbconfig';
import { useLogger } from '../logger';
import env from '../utils/env';

let database: Knex | null = null;
let databaseVersion: string | null = null;

const logger = useLogger();

async function initializeDatabase(): Promise<Knex> {
  const nodeEnv = env['NODE_ENV'] || 'development';
  const dbConfig = nodeEnv == 'development'? config.development : config.production;

  const poolConfig: Knex.PoolConfig = {
    min: 1,
    max: 6,
    afterCreate: (conn: any, done: (err: any, conn: any) => void) => {
      if (dbConfig.client === 'sqlite3') {
        conn.run('PRAGMA foreign_keys = ON', done);
      } else if (dbConfig.client === 'mysql') {
        conn.query('SELECT @@version;', (err: any, result: any) => {
          if (!err) {
            databaseVersion = result[0]['@@version'];
          }
          done(err, conn);
        });
      } else {
        done(null, conn);
      }
    },
  };

  const knexConfig: Knex.Config = {
    client: dbConfig.client,
    connection: dbConfig.connection,
    pool: poolConfig,
    log: {
      warn: logger.warn,
      error: logger.error,
      deprecate: logger.info,
      debug: logger.debug,
    },
  };

  if (dbConfig.client === 'sqlite3') {
    knexConfig.useNullAsDefault = true;
  }

  return knex(knexConfig);
}

export async function getDatabase(): Promise<Knex> {
  if (!database) {
    database = await initializeDatabase();
  }
  return database;
}

export function getDatabaseVersion(): string | null {
  return databaseVersion;
}

export async function hasDatabaseConnection(): Promise<boolean> {
  try {
    const db = await getDatabase();
    await db.raw('SELECT 1');
    return true;
  } catch (error) {
    logger.error("Failed to establish database connection.", error);
    return false;
  }
}

export async function validateDatabaseConnection(): Promise<void> {
  try {
    const db = await getDatabase();
    await db.raw('SELECT 1');
    logger.info('Database connection validated successfully.');
  } catch (error) {
    logger.error("Can't connect to the database.", error);
    process.exit(1);
  }
}