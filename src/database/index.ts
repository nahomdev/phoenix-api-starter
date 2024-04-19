import knex, {Knex} from 'knex';
import env from '../utils/env'; 
import config  from './dbconfig';
import { useLogger } from '../logger';
import { promisify } from 'util';


let database : Knex|null = null;
let databaseVersion : string | null = null;
let logger = useLogger();

export function getDatabase():Knex{
    if(database){
        return database;
    }
    
    let poolConfig:Knex.PoolConfig = {};
    let dbconfig;
    let node_env = env['NODE_ENV'] || 'development';
    if(node_env === 'production'){
        dbconfig = config.development;
    }else if(node_env == 'development'){
        dbconfig = config.production;
    }
    
    const knexConfig: Knex.Config = {
        client: dbconfig?.client,
        connection: dbconfig?.connection,
        log:{
            warn: (msg) => logger.warn(msg),
            error: (msg) => logger.error(msg),
            deprecate: (msg) => logger.info(msg),
            debug: (msg) => logger.debug(msg)
        },
        pool: poolConfig,
    }

    if(dbconfig?.client === 'sqlite3'){
        knexConfig.useNullAsDefault = true;

        poolConfig.afterCreate = async (conn:any, callback: any) =>{
            logger.trace('Enabling SQLite Foreign keys support...');
            const run = promisify(conn.run.bind(conn));
            await run('foreign_keys = ON');

            callback(null, conn);
        }
    }
    
    if(dbconfig?.client === 'mysql'){
        poolConfig.afterCreate = async (conn:any, callback:any) =>{
            logger.trace('retrieving db version');

            const run = promisify( conn.query.bind(conn));
            const version = await run('SELECT @@version;');

            callback(null, conn);
        }
    }

    database = knex.default(knexConfig); 
    return database;
}


export function getDatabaseVersion(): string | null {
    return databaseVersion;
}

export async function hasDatabaseConnection(database?:Knex): Promise<boolean> {
     database = database ?? getDatabase();

    try{
        await database.raw('SELECT 1');
        return true;
    }catch(error){
        return false;
    }   
}

export async function validateDatabaseConnection(database?:Knex): Promise<void> {
    database = database ?? getDatabase();
    
    try{
        await database.raw('SELECT 1');
    }catch(error: any){
        logger.error("Can't connect to the database.");
        logger.error(error);
        process.exit(1);
    }
}