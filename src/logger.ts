import pino from 'pino';
import type {Logger, LoggerOptions} from 'pino';
import env from './utils/env';
import { pinoHttp } from 'pino-http';
import { RequestHandler } from 'express';

export const _cache : {
    logger: Logger<never> | undefined,
} = { logger : undefined};

export const useLogger = () => {
    if(_cache.logger){
        return _cache.logger;
    }

    _cache.logger = createLogger();
    return _cache.logger;
}

export const createLogger = () => {

    const pinoOptions: LoggerOptions = {
        level: (env['LOG_LEVEL'] as string) || 'info',
        redact: {
            paths:['req.headers.authorization', 'req.headers.cookie']
        }
    }

    if(env['LOG_STYLE'] !== 'raw') {
        pinoOptions.transport = {
            target: 'pino-pretty',
            options: {
                ignore: 'hostname,pid',
                sync: true,
            }
        }
    }

    return pino(pinoOptions);
}

export const createExpressLogger = () =>{
    
    const httpLoggerOptions: LoggerOptions = {
        level: (env['LOG_LEVEL'] as string) || 'info',
        redact: {
            paths:['req.headers.authorization', 'req.headers.cookie']
        }
    }


    if(env['LOG_STYLE']!=='raw'){
        httpLoggerOptions.transport = {
            target: 'pino-http-print',
            options:{
                all: true,
                translateTime: 'SYS:HH:MM:ss',
                relativeUrl: true,
                prettyOptions:{
                    ignore: 'hostname,pid',
                    sync: true,
                }
            }   
        }
    }else{
        // case for raw style should be put here
    }


    return pinoHttp({
        logger: pino(httpLoggerOptions),
        
    }) as RequestHandler;
}