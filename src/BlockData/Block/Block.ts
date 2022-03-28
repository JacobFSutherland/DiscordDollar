import { DiscordCaptcha } from "../Captcha/DiscordCaptcha";
import { Transaction } from "../Transaction";
import { MessageEmbed } from "discord.js"
import e from "express";


export default class Block {

    private transactions: Transaction[];
    startTime: number;
    captcha: DiscordCaptcha
    reward: number;
    private isSolved: boolean;

    constructor(captcha: DiscordCaptcha){
        this.transactions = [];
        this.startTime = Date.now();
        this.captcha = captcha;
        this.reward = -1;
        this.isSolved = false;
    }

    addTransaction(T: Transaction){
        return this.transactions.push(T);
    }


    checkAnswer(A: string): boolean{
        if(A == this.captcha.value()){
            // Block Solved
            this.calculateReward();
            this.isSolved = true;
            return true;
        }else{
            // Block Not Solved
            return false;
        }
    }

    /**
    * @description Calculates the reward the block will distribute to the solver
    */
    private calculateReward(){
        let timeToSolveBlock = (Date.now()-this.startTime)/1000;
        if(timeToSolveBlock >= 400*60){
            this.reward = 100;
        }else if(timeToSolveBlock >= 180*60){
            let previousStep = 80;
            timeToSolveBlock -=180*60;
            this.reward = previousStep + timeToSolveBlock*0.1/60
        }else if(timeToSolveBlock >= 30*60){
            let previousStep = 3;
            timeToSolveBlock -=30*60;
            this.reward = previousStep + timeToSolveBlock*0.5/60
        }else {
            let previousStep = 0;
            this.reward = previousStep + timeToSolveBlock*0.1/60;
        }

    }

    /**
     * 
     * @returns Transactions in the block
     */
    getTransactions(): Transaction[]{
        return this.transactions;
    }


    toEmbed(): MessageEmbed {
        let embed: MessageEmbed = new MessageEmbed()
        embed.setTitle("New Block");
        let i = 1;
        this.transactions.forEach(transaction => {
            embed.addField(`Transaction ${i++}`, `\`${JSON.stringify(transaction)}\``, false)
        })
            
        return embed;
    }

}