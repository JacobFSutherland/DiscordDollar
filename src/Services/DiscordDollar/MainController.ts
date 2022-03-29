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
    MinableTokenName: string;

    readerbot: Client;
    chainChannel: TextChannel;
    guessChannel: TextChannel;
    /**
     * 
     * @param botInstance The discord bot that will be used to house, and maintain the chain
     * @param chainChannel The text channel that the chain will be maintained
     * @param miningChannel The text chanel that will be used to read in people's solutions to the captcha
     * @param tokenName The default token that will be used for transacting
     */
    constructor(botInstance: Client, chainChannel: TextChannel, miningChannel: TextChannel, tokenName: string){
        this.assetController = new AssetControler();
        this.guessChannel = miningChannel;
        this.blockController = new BlockController(tokenName, new Block(new DiscordCaptcha()));
        this.backendInterface = express()
        this.readerbot = botInstance;
        this.chainChannel = chainChannel;
        this.MinableTokenName = tokenName;
    }

    /**
     * @description Setter for an asset controller 
     * @param a Asset Controller
     */
    setAssetController(a: AssetControler){
        this.assetController = a;
    }

    /**
     * 
     * @param b 
     */
    addTestTransaction(t: Transaction){
        this.blockController.addTransaction(t);
    }

    /**
     * @description Setter for an asset controller 
     * @param b Block Controller
     */
    setBlockController(b: BlockController){
        this.blockController = b;
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
    }// init

    syncTransactions(transactions: Transaction[]): void {
        transactions.forEach(transaction => {
            switch(transaction.medium.callerType){
                case 'FungibleAsset':
                case 'NonFungibleAsset':
                    this.assetController.addAsset(transaction.reciver, transaction.medium as FungibleAsset | NonFungibleAsset)
                    this.assetController.remAsset(transaction.sender, transaction.medium as FungibleAsset | NonFungibleAsset)
                break;
            }
        });
    }

    forceBlockPost(){
        this.blockController.mockCorrectSolution('Mock');
        this.chainChannel.send({embeds: [this.blockController.blockToEmbed()]})
    }

    initBotWatcherCommands(){
        this.readerbot.on('messageCreate', (message) => {

            if(message.channelId == this.guessChannel.id){
                // New block guess
                let guess: BlockGuess = {
                    author: message.author.id,
                    solution: message.content,
                }
                // Check if solution was actually correct
                if(this.blockController.isCorrectSolution(guess)){
                    // Since the solution is correct, we want to process the block for posting
                    this.chainChannel.send({embeds: [this.blockController.blockToEmbed()]})

                    // All the transactions on the block that was just solved
                    let transactions = this.blockController.getBlockTransactions();

                    transactions.forEach(transaction => {
                        
                        // We only add the assets because we removed them when we put the initial transactions onto the block
                        switch(transaction.medium.callerType){
                            case 'FungibleAsset':
                                this.assetController.addAsset(transaction.reciver, transaction.medium as FungibleAsset)
                            break;
                            case 'NonFungibleAsset':
                                this.assetController.addAsset(transaction.reciver, transaction.medium as NonFungibleAsset)
                            break;
                        }
                    });
                    this.blockController.createNewBlock(this.guessChannel);

                }//if
            }//if
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
            for(let i = 0; i < blockTransactions.length; i++){
                let t = JSON.parse(blockTransactions[i].value.slice(1, blockTransactions[i].value.length-1)) as Transaction;
                transactions.push(t);
            }
        });
        return transactions; 
    }

}