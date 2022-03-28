import AssetControler from "./AssetController";
import BlockController from "./BlockController";
import express, { Express } from "express";
import router from './routes';


export default class MainController{
    private assetController: AssetControler;
    private blockController: BlockController;
    private backendInterface: Express;
    constructor(){
        this.assetController = new AssetControler();
        this.blockController = new BlockController();
        this.backendInterface = express()
        this.backendInterface.listen(3000);
    }

    initWebServer(){
        this.backendInterface.use(express.json());
        this.backendInterface.use('/', router(this.assetController, this.blockController));
    }
}