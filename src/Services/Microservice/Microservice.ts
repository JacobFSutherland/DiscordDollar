import { Transaction } from '../../BlockData';
import EconomyParticipant from '../../BlockData/EconomyParticipant';
import fetch from "node-fetch";

export class Microservice{

    domain: string; // domain of the main server

    /**
     * 
     * @param domain The domain of the main application
     */
    constructor(domain: string){
        this.domain = domain;
    }

    /**
     * @description Gets an economy user given their discord id. Throws an error if they are not found
     * @returns The economy participant of with the discord ID provided
     * @param discordID The discord id of the economy participant
     */
    async getUser(discordID: string): Promise<EconomyParticipant> {
        try{
            const response = await fetch(`${this.domain}/bal/${discordID}`);
            return await response.json() as EconomyParticipant;
        }catch(e){
            throw new Error(`Error: ${e}`);
        }
    }

    /**
     * @description Adds a transaction
     * @returns a boolean used to determine whether the transaction successfully pushed, or was rejected
     * @param t The transaction you are attempting to push
     */
    async addTransaction(t: Transaction): Promise<boolean> {
        try{
            const response = await fetch(`${this.domain}/addTransaction`, {
                method: 'post',
                body: JSON.stringify(t),
                headers: {'Content-Type': 'application/json'}
            });
            return response.status == 200;
        }catch(e){
            return false;
        }
    }

}