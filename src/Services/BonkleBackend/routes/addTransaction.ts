import { Router, Request, Response, json } from "express";
import { Transaction } from "../../../BlockData";
import EconomyParticipant from "../../../BlockData/EconomyParticipant";
import FungibleAsset from "../../../BlockData/FungibleAssets/FungibleAsset";
import Asset from "../../../BlockData/FungibleAssets/FungibleAsset";
import NonFungibleAsset from "../../../BlockData/NonFungibleAssets/NonFungibleAsset";
import Service from "../../../BlockData/Services/Service";
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
                        medium = body.medium as NonFungibleAsset;
                    break;
                case 'FungibleAsset':
                        medium = body.medium as NonFungibleAsset
                    break;
                case 'Service':
                        medium = body.medium as Service
                    break;
            }
            
            

        }catch(e) {
            res.status(400).send("Error processing transaction");

        }
    })

    return router;
}