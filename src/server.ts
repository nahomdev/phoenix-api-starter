import { createApp } from './index';
import * as http from 'http';
import env from './utils/env';
import { useLogger} from './logger';

const logger = useLogger();

export async function createServer(): Promise<http.Server>{

    const server = await http.createServer(await createApp());

    return server;
}

export async function startServer(): Promise<void>{
    const server = createServer();

    const port = env['PORT'] || 9001;
    (await server).listen(port,()=>{
        logger.info(`server is up and running on port ${port}`);
    })
}