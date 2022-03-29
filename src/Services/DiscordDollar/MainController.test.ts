import MainController from "./MainController";
import AssetController from "./AssetController";
import { Client, Intents, TextChannel, Message } from 'discord.js';
import Token from "../../BlockData/FungibleAssets/Token";
import Stock from "../../BlockData/FungibleAssets/Stock";
import Option from "../../BlockData/FungibleAssets/Option";
import NFT from "../../BlockData/NonFungibleAssets/NFT";
import Quote from "../../BlockData/NonFungibleAssets/Quotes";
import { Transaction } from "../../BlockData";
import env from '../../../env';
import EconomyParticipant from "../../BlockData/EconomyParticipant";

jest.setTimeout(8000);

let assetControler = new AssetController();
let testBot: Client = new Client({intents:[Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_VOICE_STATES]});
let testChainChannel: TextChannel; 
let testGuessChannel: TextChannel;
EconomyParticipant.GiveAdminBal('Sender');




        
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
        let testMainController: MainController;


        beforeAll(() => {
            testBot.login(env.testnetToken)
            testGuessChannel = testBot.channels.cache.get(env.testGuess) as TextChannel;
            testChainChannel = testBot.channels.cache.get(env.testChain) as TextChannel;
            testMainController = new MainController(testBot, testChainChannel, testGuessChannel, 'Test Token');
            testMainController.setAssetController(assetControler);
        })

        test('multiple FungibleAsset as transactions', () => {
            let transactions: Transaction[] = [];
            let fung = [t1, t2, t3, s1, s2, s3, o1, o2, o3]
            fung = fung.sort(() => Math.random() - 0.5);
            fung.forEach(asset => {
                transactions.push(new Transaction('Reciever', asset, 'Sender'));
            })

            testMainController.syncTransactions(transactions);

            expect(assetControler.userAssets['Reciever'].fungibleAssets[t1.name].amount).toEqual(t1.amount)
            expect(assetControler.userAssets['Reciever'].fungibleAssets[t2.name].amount).toEqual(t2.amount)
            expect(assetControler.userAssets['Reciever'].fungibleAssets[t3.name].amount).toEqual(t3.amount)

            expect(assetControler.userAssets['Reciever'].fungibleAssets[s1.name].amount).toEqual(s1.amount)
            expect(assetControler.userAssets['Reciever'].fungibleAssets[s2.name].amount).toEqual(s2.amount)
            expect(assetControler.userAssets['Reciever'].fungibleAssets[s3.name].amount).toEqual(s3.amount)

            expect(assetControler.userAssets['Reciever'].fungibleAssets[o1.name].amount).toEqual(o1.amount)
            expect(assetControler.userAssets['Reciever'].fungibleAssets[o2.name].amount).toEqual(o2.amount)
            expect(assetControler.userAssets['Reciever'].fungibleAssets[o3.name].amount).toEqual(o3.amount)

        })
        //test('multiple NonFungible Asset as transactions', () => {
//
        //})
//
        //test('multiple serves as transactions', () => {
//
        //})
//
        //test('Combination of multiple fungible, nonfungible assets and services', () => {
//
        //})

    }) 
})