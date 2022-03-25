import { WebSocketServer } from 'ws';
import * as express from 'express';

export class MasterService {
  private endpoint: express.Application = express();
  private server: WebSocketServer;

  constructor() {
    this.server = new WebSocketServer({ port: 9000 });
    this.endpoint.listen(9000);
  }
}
