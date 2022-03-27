import { Router, Request, Response, json } from "express";
import { Transaction } from "../../../BlockData";
import FungibleAsset from "../../../BlockData/Fungible/FungibleAsset";
import Asset from "../../../BlockData/Fungible/FungibleAsset";
import AssetControler from "../AssetController";
import BlockController from "../BlockController";

const router: Router = Router();
router.use(json());

/**
 * 
 * @param assets The asset controller that will be used to process the transaction
 */
export default (assets: AssetControler, block: BlockController): Router => {
    router.post('/', (req: Request, res: Response) => {
        try{

            let body: Transaction = JSON.parse(req.body) as Transaction
            

        }catch(e) {
            res.status(400).send("Error processing transaction");

        }
    })

    return router;
}