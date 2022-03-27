import AssetControler from "./AssetController";
import BlockController from "./BlockController";
import express, { Express } from "express";


export default class MainController{
    private AssetController: AssetControler;
    private BlockController: BlockController;
    private BackendInterface: Express;
    constructor(){
        this.AssetController = new AssetControler();
        this.BlockController = new BlockController();
        this.BackendInterface = express()
        this.BackendInterface.listen(3000);
    }
}