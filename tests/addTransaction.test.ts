import request from 'supertest';
import addTransaction from './addTransaction';
import { AssetController } from '../AssetController';
import { BlockController} from '../BlockController';
import Express from "express"
import NonFungibleAsset from '../../../BlockData/NonFungibleAssets/NonFungibleAsset';
import { Token } from '../../../BlockData/FungibleAssets/Token';
import { Stock } from '../../../BlockData/FungibleAssets/Stock';
import NFT from '../../../BlockData/NonFungibleAssets/NFT';
import { Transaction } from '../../../BlockData';
import { Block } from '../../../BlockData/Block/Block';
import { DiscordCaptcha } from '../../../BlockData/Captcha/DiscordCaptcha';

let assetController = new AssetController();
let blockController = new BlockController("Test Token", new Block(new DiscordCaptcha()));
const app = Express()
app.use(Express.json());

let token1 = "Example Token 1";
let token2 = "Example Token 2";

let user1 = "User 1";
let user2 = "User 2";
let user3 = "User 3";
let user4 = "User 4";

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

app.use('/', addTransaction(assetController, blockController));

describe ("POST /AddTransaction", () => {

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

    describe ("Testing invalid transactions:", () => {

        test("User tries to send a token they do not have enough of", async () => {

            // Transaction of user 2 sending more Token 1 than they have to user 1

            let T = new Transaction(user1, new Token(token1, 20), user2);
            let res = await request(app).post('/').send(T)
            expect(assetController.userAssets[user1].fungibleAssets[token1].amount).toBe(t1.amount);
            expect(assetController.userAssets[user2].fungibleAssets[token1].amount).toBe(t2.amount);
            expect(res.headers['content-type']).toContain('json');
            expect(res.statusCode).toBe(400);

        })// test

        test("User tries to send a token they do not have", async () => {

            // Transaction of user 2 sending a token they do not have to user 1

            let T = new Transaction(user1, new Token("Non-existant Token", 20), user2);
            const res = await request(app).post('/').send(T)
            expect(res.headers['content-type']).toContain('json');
            expect(assetController.userAssets[user1].fungibleAssets["Non-Existant Token"]).toBeUndefined()
            expect(assetController.userAssets[user2].fungibleAssets["Non-Existant Token"]).toBeUndefined()
            expect(res.statusCode).toBe(400);

        })// test

        test("User does not have the non-fungible item", async () => {

            // Transaction of user 2 sending a token they do not have to user 1

            let T = new Transaction(user1, NFA3, user2);
            const res = await request(app).post('/').send(T)
            expect(res.headers['content-type']).toContain('json');
            expect(assetController.userAssets[user1].nonFungibleAssets[NFA3.id]).toBeUndefined()
            expect(assetController.userAssets[user2].nonFungibleAssets[NFA3.id]).toBeUndefined()
            expect(res.statusCode).toBe(400);
        })

        test("A user that has not participated in the economy has just tried to send tokens", async () => {

            // Transaction of user 2 sending a token they do not have to user 1

            let T = new Transaction(user1, t1, user4);
            let res = await request(app).post('/').send(T)
            expect(res.statusCode).toBe(400);
            expect(assetController.userAssets[user4].fungibleAssets[token1]).toBeUndefined()
            expect(assetController.userAssets[user2].fungibleAssets[token1].amount).toBe(t2.amount)

        })// test
    })

    describe ("Testing valid transactions:", () => {

        test("User1 sends a token they have enough of to user 2", async () => {

            // Transaction of user 1 sending Token 1 to user 1

            let T = new Transaction(user2, new Token(token1, 2), user1);
            let res = await request(app).post('/').send(T)
            expect(res.headers['content-type']).toContain('json');
            expect(res.statusCode).toBe(200);
            expect(assetController.userAssets[user1].fungibleAssets[token1].amount).toBe(t1.amount - 2);
            expect(assetController.userAssets[user2].fungibleAssets[token1].amount).toBe(t2.amount);

        })// test

    })

});