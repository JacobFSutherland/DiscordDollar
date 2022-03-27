import { Router, Request, Response } from "express";
import AssetControler from "../AssetController";

const router: Router = Router();

/**
 * 
 * @param assets The asset controller that will be used to process the balance queries
 */
export default function (assets: AssetControler): Router {
    router.get('/:id/:assetName', (req: Request, res: Response) => {

    })

    return router;
}