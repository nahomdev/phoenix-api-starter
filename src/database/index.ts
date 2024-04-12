import knex from 'knex';
import type { Knex } from 'knex';
import env from '../utils/env';
import { useLogger } from '../logger';

let database: Knex | null = null;

export function getDatabase(): Knex {
    if(database){
        return database;
    }

    let client = env['DB_CLIENT'];
    let connectionString = env['DB_CONNECTION_STRING'];
    // let pool = env['DB_POOL'] 
    // let version = env['DB_VERSION'];


    let requiredVariables = ['DB_CLIENT'];

    switch(client){
        case 'sqlite3':
            requiredVariables.push('DB_FILENAME')
            break;
        case 'oracledb':
            if(!connectionString){
                requiredVariables.push('DB_HOST', 'DB_PORT','DB_DATABASE','DB_USER','DB_PASSWORD');
            }else{
                requiredVariables.push('DB_USER','DB_PASSWORD','DB_CONNECTION_STRING')
            }
            break;
        case 'pg':
            if(!connectionString){
                requiredVariables.push('DB_HOST', 'DB_PORT','DB_DATABASE','DB_USER');
            }else{
                requiredVariables.push('DB_CONNECTION_STRING')
            }
            break;
        case 'mysql':
            if(!env['DB_PATH']){
                requiredVariables.push('DB_HOST', 'DB_PORT','DB_DATABASE','DB_USER','DB_PASSWORD');
            }else{
                requiredVariables.push('DB_PATH');
            }
            break; 
        default:
            requiredVariables.push('DB_HOST','DB_PORT','DB_DATABASE','DB_USER','DB_PASSWORD');

    }


}