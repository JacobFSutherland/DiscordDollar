import request from 'supertest';
import AssetControler from '../AssetController';
import BlockController from '../BlockController';
import Express from "express"
import Token from '../../../BlockData/FungibleAssets/Token';
import Stock from '../../../BlockData/FungibleAssets/Stock';
import NFT from '../../../BlockData/NonFungibleAssets/NFT';
import EconomyParticipant from '../../../BlockData/EconomyParticipant';
import bal from './bal';

let assetController = new AssetControler();
let blockController = new BlockController();
const app = Express()
app.use(Express.json());

let token1 = "Example Token 1";
let token2 = "Example Token 2";

let user1 = "User_1";
let user2 = "User_2";
let user3 = "User_3";
let user4 = "User_4";

// Test Non-Fungible Asset
let NFA1 = new NFT();
let NFA2 = new NFT();
let NFA3 = new NFT();

// Test Tokens
let t1 = new Token(token1, 10.28);
let t2 = new Token(token1, 12.95);
let t3 = new Token(token1, 19.5);

let t4 = new Token(token2, 1.28);
let t5 = new Token(token2, 2.95);
let t6 = new Token(token2, 0.5);

// Test Stocks
let s1 = new Stock("$BB", 10);
let s2 = new Stock("$GME", 2);
let s3 = new Stock("$FRT", 5);

app.use('/', bal(assetController));

describe ("GET /:id", () => {

    // Adding all assets manually into asset controller
    assetController.addAsset(user1, NFA1);
    assetController.addAsset(user2, NFA2);
    assetController.addAsset(user3, NFA3);

    assetController.addAsset(user1, t1);
    assetController.addAsset(user2, t2);
    assetController.addAsset(user3, t3);

    assetController.addAsset(user1, t4);
    assetController.addAsset(user2, t5);
    assetController.addAsset(user3, t6);

    assetController.addAsset(user1, s1);
    assetController.addAsset(user2, s2);
    assetController.addAsset(user3, s3);

    describe ("Testing gets on a specific user", () => {

        test("User get's that user's EconomyParticipant Object associated with the user queried", async () => {

            // Getting the first user

            let res = await request(app).get(`/${user1}`);
            expect(res.headers['content-type']).toContain('json');
            expect(res.statusCode).toBe(200);
            expect(() => res.body as EconomyParticipant).not.toThrowError();
            expect(res.body).toEqual(assetController.userAssets[user1]);

        })// test

        test("getting a user that does not exist returns correctly", async () => {

            // Getting the first user

            let res = await request(app).get(`/nonesistantuser`);
            expect(res.headers['content-type']).toContain('json');
            expect(res.statusCode).toBe(404);

        })// test
    });

});