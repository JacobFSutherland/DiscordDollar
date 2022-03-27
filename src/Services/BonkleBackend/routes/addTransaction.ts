import { Router, Request, Response, json } from "express";
import { Transaction } from "../../../BlockData";
import FungibleAsset from "../../../BlockData/FungibleAssets/FungibleAsset";
import NonFungibleAsset from "../../../BlockData/NonFungibleAssets/NonFungibleAsset";
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
            let body: Transaction = JSON.parse(req.body) as Transaction;
            let medium;
            switch(body.medium.callerType){
                case 'NonFungibleAsset':
                case 'FungibleAsset':
                    medium = body.medium as FungibleAsset | NonFungibleAsset
                    assets.remAsset(body.sender, medium);
                    break;
                case 'Service':
                    break;
            }
            //Add transaction to block
        }catch(e) {
            // We know if we catch an error, it was likely going to be an illegal transaction, IE: overspending
            res.status(400).send("Error processing transaction");
        }
    })

    return router;
}