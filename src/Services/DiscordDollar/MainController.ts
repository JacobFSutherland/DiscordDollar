import { Client, TextChannel, Intents, Message } from "discord.js";
import express, { Express } from "express";
import { Block, DiscordCaptcha, Transaction, FungibleAsset, NonFungibleAsset, BlockGuess } from "../../BlockData";
import { AssetController } from "./AssetController";
import { BlockController } from "./BlockController";
import router from './routes'



export class MainController {
    
    private assetController: AssetController;
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
        this.assetController = new AssetController();
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
    setAssetController(a: AssetController){
        this.assetController = a;
    }

    /**
     * 
     * @param b a test transaction being added to the block
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


    /**
     * @description Starts the application with default settings
     */
    async autoStart(): Promise<void> {
        let blocks = await this.fetchBlocksFromChain();
        let transactions = MainController.parseBlocksToTransactions(blocks);
        this.syncTransactions(transactions);
        await this.init();
        this.initBotWatcherCommands();
        await this.blockController.postCaptcha(this.guessChannel);
    }

    /**
     * @description Syncs the transactions provided
     * @param transactions The transactions to be synced
     * @returns void 
     */
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

    /**
     * @description Forces a block to be pushed to the chainChannel. Useful for debugging
     * @returns void 
     */
    forceBlockPost(){
        this.blockController.mockCorrectSolution('Mock');
        this.chainChannel.send({embeds: [this.blockController.blockToEmbed()]})
    }

    /**
     * @description Initializes the bot's command to listen for block solutions
     * @returns void 
     */
    initBotWatcherCommands(){
        this.readerbot.on('messageCreate', (message) => {

            if(message.channelId == this.guessChannel.id){
                // New block guess
                let guess: BlockGuess = {
                    author: message.author.id,
                    solution: message.content,
                }
                console.log('Trying solution: ', message.content);
                // Check if solution was actually correct
                if(this.blockController.isCorrectSolution(guess)){

                    console.log('solution was correct');
                    // Since the solution is correct, we want to process the block for posting
                    this.blockController.ocupied = true; // Lock the block so nobody else can try to answer it
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
                    let captcha = new DiscordCaptcha()
                    console.log('new solution: ', captcha.value());
                    this.blockController.createNewBlock(this.guessChannel, captcha);

                }//if
                this.blockController.ocupied = false;
            }//if
        })
    }

    async fetchBlocksFromChain(): Promise<Message[]> {
        let blocks: Message[] = [];
        let lastID;
        while(true){
            const fetchedBlocks: any = await this.chainChannel.messages.fetch({
                limit: 100,
                ...(lastID && { before: lastID }),
            });;

            if (fetchedBlocks.size === 0) {
                return blocks.reverse();
            }
            console.log(`Adding ${fetchedBlocks.size} Blocks`);
            blocks = blocks.concat(Array.from(fetchedBlocks.values()));
            lastID = fetchedBlocks.lastKey();
        }
    }

    static parseBlocksToTransactions(blocks: Message[]): Transaction[] {
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