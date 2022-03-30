import { Router, Request, Response, json } from "express";
import { Transaction } from "../../../BlockData";
import { FungibleAsset } from "../../../BlockData/FungibleAssets/FungibleAsset";
import NonFungibleAsset from "../../../BlockData/NonFungibleAssets/NonFungibleAsset";
import { AssetController } from "../AssetController";
import { BlockController} from "../BlockController";

/**
 * 
 * @param assets The asset controller that will be used to validate, and process the transaction
 */
export default (assets: AssetController, block: BlockController): Router => {
    const router: Router = Router();
    router.post('/', (req: Request, res: Response) => {
        res.setHeader('Content-Type', 'application/json');
        try{
            let body: Transaction = req.body as Transaction;
            let medium: FungibleAsset | NonFungibleAsset;
            switch(body.medium.callerType){
                case 'NonFungibleAsset':
                case 'FungibleAsset':
                    medium = body.medium as FungibleAsset | NonFungibleAsset
                    assets.remAsset(body.sender, medium);
                    break;
            }
            //Add transaction to block
            block.addTransaction(body);
            res.status(200).send(JSON.stringify({status: 'success'}));
        }catch(e: any) {   
            // We know if we catch an error, it was likely going to be an illegal transaction, IE: overspending
            res.status(400).send({error: e});
        }
    })
    return router;
}