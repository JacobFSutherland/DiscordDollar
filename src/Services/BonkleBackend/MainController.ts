import AssetControler from "./AssetController";
import BlockController from "./BlockController";
import express, { Express } from "express";
import bal from './routes/bal';
import addTransaction from './routes/addTransaction';


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
        this.backendInterface.use('/bal', bal(this.assetController));
        this.backendInterface.use('/addTrasaction', addTransaction(this.assetController, this.blockController))
    }
}