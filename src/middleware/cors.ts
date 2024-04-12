import cors from 'cors';
import type { RequestHandler } from 'express';
import env from '../utils/env';
 
let corsMiddleware:RequestHandler = (_req, _res, next) => next();

if(env['CORS_ENABLED']){
    corsMiddleware = cors({
        origin:env['CORS_ORIGIN'] || true,
        methods:env['CORS_METHODS'] || 'GET,POST,PATCH,PUT,DELETE',
        allowedHeaders:env['CORS_ALLOWED_HEADERS'] as string,
        exposedHeaders:env['CORS_EXPOSED_HEADERS'] as string,
        // credentials:(env['CORS_CREDENTIALS'] as boolean )|| undefined,
    })
}


export default corsMiddleware;