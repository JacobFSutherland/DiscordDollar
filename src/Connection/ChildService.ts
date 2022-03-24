import WebSocket, { WebsocketServer } from 'ws';

export default class ChildService {
    private WebsocketServer: WebsocketServer;
    private ServiceName: string;

    /**
     * 
     * @param name The name of the application
     * @param ip The IP of the main application that the child service is connected to
     * @param port The port of the main application that the child service is connected to
     */

    constructor(name: string, ip: string, port: number){
        this.WebsocketServer = new WebsocketServer({ip, port});
        this.ServiceName = name
    }
}