import { createApp } from './index';
import * as http from 'http';
import env from './utils/env';
import { useLogger} from './logger';

const logger = useLogger();

export async function createServer(): Promise<http.Server>{
    try{
        const app = await createApp();
        const server = await http.createServer(app);
        return server;
    }catch(error){
        logger.error("Failed to create server : ", error);
        throw error;
    }
}

export async function startServer(): Promise<void>{
    try{
        const server = createServer();
        const port = env['PORT'] || 9001;
        (await server).listen(port,()=>{
            logger.info(`server is up and running on port ${port}`);
        })
    }catch(error){
        logger.error("Failed to Start Server : ", error);
        process.exit(1);
    }
}