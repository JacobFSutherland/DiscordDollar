import { Router, Request, Response } from "express";
import { AssetController } from "../AssetController";

const router: Router = Router();

/**
 * 
 * @param assets The asset controller that will be used to process the balance queries
 */
export default function (assets: AssetController): Router {
    const router: Router = Router();
    router.get('/:id', (req: Request, res: Response) => {
        res.setHeader('Content-Type', 'application/json');
        if(assets.userAssets[req.params.id])
            res.status(200).send(assets.userAssets[req.params.id]);
        res.status(404).send({});
    })

    return router;
}