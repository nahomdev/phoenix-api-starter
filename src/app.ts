import express, { Request, Response, NextFunction } from 'express';
import qs from 'qs';
import helmet from 'helmet';
import cors from './middleware/cors';
import cookieParser from 'cookie-parser';
import { createExpressLogger } from './logger';
import rateLimit from 'express-rate-limit';
import { errors } from 'celebrate'; 
import { validateDatabaseConnection } from './database';

export default async function createApp(): Promise<express.Application> {
    const app = express();

    app.disable('x-powered-by');
    app.set('query parser', (str: string) => qs.parse(str, { depth: 10 }));
    app.use(helmet({
        contentSecurityPolicy: false, 
    }));

    app.use(cors);
    app.use(express.json());
    app.use(cookieParser());
    app.use(rateLimit({
        windowMs: 15 * 60 * 1000, 
        max: 100, 
    }));

    app.use((_req, res, next) => {
        res.setHeader('X-Powered-By', 'Phoenix');
        next();
    });

 
    app.use(createExpressLogger());

    //start database connection
    validateDatabaseConnection();

    // route
    app.get('/', (_req, res) => {
        res.status(200).json({
            status: "successful",
            message: "Welcome to Phoenix Backend Starter"
        });
    });

 
    app.use(errors());


    app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
        console.error(err.stack);
        res.status(500).send({ error: 'Something broke!' });
    });

    return app;
} 