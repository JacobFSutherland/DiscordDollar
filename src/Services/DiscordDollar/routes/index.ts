import { Router } from "express";
import { AssetController } from "../AssetController";
import { BlockController } from "../BlockController";
import addTransaction from "./addTransaction";
import bal from "./bal";


export default (assets: AssetController, block: BlockController): Router => {
    const routes = Router();
    routes.use('/addTransaction', addTransaction(assets, block));
    routes.use('/bal', bal(assets));
    return routes;
}