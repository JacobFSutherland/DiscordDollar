import Stock from "./Goods/Stock";
import Token from "./Goods/Token";
import Option from "./Goods/Option";
import TSMap from "./TSMap";
import assert from "assert";

export default class EconomyParticipant{
    static addedIDs: string[] = [];
    discordID: string;
    tokens: TSMap<Token>;
    stocks: TSMap<Stock>;
    options: TSMap<Option>;

    /**
     * 
     * @param id The ID of the Discord user that is being initialized as an economy participant
     */
    constructor(id: string){
        assert(!EconomyParticipant.addedIDs.includes(id), 'Duplicate Economy Participant');
        EconomyParticipant.addedIDs.push(id);
        this.discordID = id; 
        this.tokens = {};
        this.stocks = {};
        this.options = {};
    }

    /**
     * 
     * @param token The token being added to the Discord user. 
     */
    addToken(token: Token){
        if(this.tokens[token.name]){ 
            this.tokens[token.name].add(token); // if the token exists within the user's known token balances, the sums are totaled and updated accordingly.
        }else{
            this.tokens[token.name] = new Token(token.name, token.amount); // if the token does not exist within the user's known token balances, the token is cloned and set.
        }//if
    } //addToken

    /**
     * 
     * @param token The token being subtracted from the Discord user. 
     */
    removeToken(token: Token){
        assert(this.tokens[token.name], `Token not found in user ${this.discordID}`);
        this.tokens[token.name].remove(token); // if the token exists within the user's known token balances, the sums are totaled and updated accordingly.
    }


}