export default class ChildService {
    private Socket: WebSocket;
    private ServiceName: string;

    /**
     * 
     * @param name The name of the application
     * @param ep The endpoint that gives you the information needed to connect to your service, as well as the port
     */

    constructor(name: string, ep: string){
        this.Socket = new WebSocket('');
        this.ServiceName = name
    } 
}