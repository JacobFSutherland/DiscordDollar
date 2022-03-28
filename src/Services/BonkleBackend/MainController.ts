import AssetControler from "./AssetController";
import BlockController from "./BlockController";
import express, { Express } from "express";
import router from './routes';
import { Client, Intents, TextChannel, Message } from 'discord.js';
import Block from "../../BlockData/Block/Block";
import { DiscordCaptcha } from "../../BlockData/Captcha/DiscordCaptcha";
import { Transaction } from "../../BlockData";
import FungibleAsset from "../../BlockData/FungibleAssets/FungibleAsset";
import NonFungibleAsset from "../../BlockData/NonFungibleAssets/NonFungibleAsset";
import { BlockGuess } from "../../BlockData/Block/BlockGuess";


export default class MainController{
    private assetController: AssetControler;
    private blockController: BlockController;
    private backendInterface: Express;
    private MinableTokenName: string;

    readerbot: Client;
    chainChannel: TextChannel;
    readGuesses: TextChannel;
    /**
     * 
     * @param botInstance The discord bot that will be used to house, and maintain the chain
     * @param chainChannel The text channel that the chain will be maintained
     * @param miningChannel The text chanel that will be used to read in people's solutions to the captcha
     * @param tokenName The default token that will be used for transacting
     */
    constructor(botInstance: Client, chainChannel: TextChannel, miningChannel: TextChannel, tokenName: string){
        this.assetController = new AssetControler();
        this.readGuesses = miningChannel;
        this.blockController = new BlockController(tokenName, new Block(new DiscordCaptcha()));
        this.backendInterface = express()
        this.readerbot = botInstance;
        this.chainChannel = chainChannel;
        this.MinableTokenName = tokenName;
    }
    /**
     * 
     * @returns An array of discord intents that are needed by the bot to properly interface with the Bonkle Buck Backend
     */
    static intents(): {intents: number[]} {
       return {intents:[Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_VOICE_STATES]};
    }



    /**
     * @description Used to bind the webserver to the routes associated to the EPs of the Bonkle Buck API
     */
    async init(): Promise<void>{
        this.backendInterface.use(express.json());
        this.backendInterface.use('/', router(this.assetController, this.blockController));
        this.backendInterface.listen(3000);

        let transactions = await MainController.parseBlocksToTransactions(await this.fetchBlocksFromChannel());

        transactions.forEach(transaction => {
            switch(transaction.medium.callerType){
                case 'FungibleAsset':
                    this.assetController.addAsset(transaction.reciver, transaction.medium as FungibleAsset)
                    this.assetController.remAsset(transaction.sender, transaction.medium as FungibleAsset)
                break;
                case 'NonFungibleAsset':
                    this.assetController.addAsset(transaction.reciver, transaction.medium as NonFungibleAsset)
                    this.assetController.remAsset(transaction.sender, transaction.medium as NonFungibleAsset)
                break;
            }
        });

    }// init

    initBotWatcherCommands(){
        this.readerbot.on('messageCreate', (message) => {

            switch(message.channelId){
                case this.chainChannel.id:
                    // New block guess
                    let guess: BlockGuess = {
                        author: message.author.id,
                        solution: message.content,
                    }
                    // Check if solution was actually correct
                    if(this.blockController.isCorrectSolution(guess)){
                        // Since the solution is correct, we want to process the block for posting
                        this.blockController.transferPendingToSubmitBlock();
                        this.blockController.blockToEmbed();
                    }
                    break;
                case this.chainChannel.id:
                    // New block posted
                    break;
            }
        })
    }

    async fetchBlocksFromChannel(): Promise<Message[]> {
        let blocks: Message[] = [];
        let lastID;
        while(true){
            const fetchedBlocks: any = await this.chainChannel.messages.fetch({
                limit: 100,
                ...(lastID && { before: lastID }),
            });;

            if (fetchedBlocks.size === 0) {
                console.log(JSON.stringify(fetchedBlocks));
                return blocks.reverse();
            }
            console.log(`Adding ${fetchedBlocks.size} Blocks`);
            blocks = blocks.concat(Array.from(fetchedBlocks.values()));
            lastID = fetchedBlocks.lastKey();
        }
    }

    static async parseBlocksToTransactions(blocks: Message[]): Promise<Transaction[]> {
        let transactions: Transaction[] = [];
        blocks.forEach(block => {
            let blockTransactions = block.embeds[0].fields;
            // Parses Blocks into all it's original Transactions
            for(let i = 2; i < blockTransactions.length; i++){
                let t = JSON.parse(blockTransactions[i].value.slice(1, blockTransactions[i].value.length-1)) as Transaction;
                transactions.push(t);
            }
        });
        return transactions; 
    }





}