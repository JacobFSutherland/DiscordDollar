import MainController from "./MainController";
import AssetController from "./AssetController";
import { Client, Intents, TextChannel, Message } from 'discord.js';
import BlockController from "./BlockController";
import Block from "../../BlockData/Block/Block";
import { DiscordCaptcha } from "../../BlockData/Captcha/DiscordCaptcha";
import Token from "../../BlockData/FungibleAssets/Token";
import Stock from "../../BlockData/FungibleAssets/Stock";
import Option from "../../BlockData/FungibleAssets/Option";
import NFT from "../../BlockData/NonFungibleAssets/NFT";
import Quote from "../../BlockData/NonFungibleAssets/Quotes";
import { Transaction } from "../../BlockData";
import env from '../../../env';


let assetControler = new AssetController();
let addAssetSpy = jest.spyOn(assetControler, 'addAsset');
let remAssetSpy = jest.spyOn(assetControler, 'remAsset');
let captcha = new DiscordCaptcha();
let block = new Block(captcha);
let blockController: BlockController = jest.createMockFromModule('./BlockController')
let testBot: Client = new Client(MainController.intents());
let testChainChannel: TextChannel; 
let testGuessChannel: TextChannel;




        
describe('Test Main Controller', () => {

    describe('Test Block Syncer', () => {

        let t1 = new Token("Tester Token", 10.95);
        let t2 = new Token("Super Tester Token", 5.12);
        let t3 = new Token("Super Mega Tester Token", 9.32);

        let s1 = new Stock("$up", 15);
        let s2 = new Stock("$down", 20);
        let s3 = new Stock("$Sideways", 40);

        let o1 = new Option('$up', 20, 'Calls', 5.50);
        let o2 = new Option('$down', 42, 'Puts', 4.50);
        let o3 = new Option('$Sideways', 42, 'Puts', 4.50);

        let nft1 = new NFT();
        let nft2 = new NFT();
        let nft3 = new NFT();

        let q1 = new Quote();
        let q2 = new Quote();
        let q3 = new Quote();


        beforeAll( async () => {
            await testBot.login(env.testnetToken);
            testChainChannel = testBot.channels.cache.get(env.testChain) as TextChannel
            testGuessChannel  = testBot.channels.cache.get(env.testGuess) as TextChannel  
            let testMainController = new MainController(testBot, testChainChannel, testGuessChannel, 'Test Token');
          
        })

        test('multiple FungibleAsset as transactions', () => {
            let transactions: Transaction[] = [new Transaction('solver', new Token('Test Token', 22.182), 'BLOCK_REWARD')]; // Example Block Reward
            let assets = [t1,t2,t3,s1,s2,s3,o1,o2,o3];
            assets = assets.sort(() => (Math.random() > .5) ? 1 : -1);
            assets.forEach(asset => {
                transactions.push(new Transaction('Reciever', asset, 'Sender'));
            });

            testMainController.init(transactions);

            expect(remAssetSpy).toBeCalledTimes(transactions.length);
            expect(addAssetSpy).toBeCalledTimes(transactions.length);

        })

        test('multiple NonFungible Asset as transactions', () => {

        })

        test('multiple serves as transactions', () => {

        })

        test('Combination of multiple fungible, nonfungible assets and services', () => {

        })

    }) 
})