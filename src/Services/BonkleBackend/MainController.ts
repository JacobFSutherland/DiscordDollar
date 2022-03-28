import AssetControler from "./AssetController";
import BlockController from "./BlockController";
import express, { Express } from "express";
import router from './routes';
import { Client, Intents } from 'discord.js';
import Block from "../../BlockData/Block/Block";
import { DiscordCaptcha } from "../../BlockData/Captcha/DiscordCaptcha";


export default class MainController{
    private assetController: AssetControler;
    private blockController: BlockController;
    private backendInterface: Express;
    private readerbot: Client;
    private chainChannel: string;
    private secret: string;
    private MinableTokenName: string;
    /**
     * 
     * @param botSecret The secret to the discord bot that will be used to house the chain
     * @param chainChannel The text channel that the chain will be maintained
     * @param tokenName The default token that will be used for transacting
     */
    constructor(botSecret: string, chainChannel: string, tokenName: string){
        this.assetController = new AssetControler();
        this.blockController = new BlockController(tokenName, new Block(new DiscordCaptcha()));
        this.backendInterface = express()
        this.readerbot = new Client({intents:[Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_VOICE_STATES]});
        this.secret = botSecret;
        this.chainChannel = chainChannel;
        this.MinableTokenName = tokenName;
    }



    /**
     * @description Used to bind the webserver to the routes associated to the EPs of the Bonkle Buck API
     */
    async init(): Promise<void>{
        this.backendInterface.use(express.json());
        this.backendInterface.use('/', router(this.assetController, this.blockController));
        this.backendInterface.listen(3000);
        await this.readerbot.login(this.secret);
    }// init


}