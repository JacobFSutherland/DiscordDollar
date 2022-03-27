import Stock from "./Goods/Stock";
import Token from "./Goods/Token";
import Option from "./Goods/Option";
import TSMap from "./TSMap";

export default class EconomyParticipant{
    discordID: string;
    tokens: TSMap<Token>;
    stocks: TSMap<Stock>;
    options: TSMap<Option>;

    /**
     * 
     * @param id The ID of the Discord user that is being initialized as an economy participant
     */
    constructor(id: string){
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
        if(this.tokens[token.name]) //Checking if the token exists within the user's known token balances
            this.tokens[token.name].add(token);
        
    }

    removeToken(token: Token){

    }


}