import { createApp } from './index';
import * as http from 'http';
import env from './utils/env';

export async function createServer(): Promise<http.Server>{

    const server = await http.createServer(await createApp());

    return server;
}

export async function startServer(): Promise<void>{
    const server = createServer();

    const port = env['PORT'] || 9001;
    (await server).listen(port,()=>{
        console.log(`server is up and running on port ${port}`);
    })
}