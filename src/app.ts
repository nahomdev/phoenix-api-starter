import express from 'express';
import qs from 'qs';
import helmet from 'helmet';
import cors from './middleware/cors';
import cookieParser from 'cookie-parser';

export default async function createApp(): Promise<express.Application>{
    const app = express();

    app.disable('x-powered-by');
    app.set('query parser', (str:string) => qs.parse(str, {depth:10}));
    app.use(helmet());
    app.use(cors);
    app.use(express.json());
    app.use(cookieParser());
    app.use((_req, res, next)=>{
         res.setHeader('x-powered-by','phoenix');
         next();
    })


    return app;
}