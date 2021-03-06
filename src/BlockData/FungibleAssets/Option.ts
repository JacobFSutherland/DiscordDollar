import assert from "assert";
import { FungibleAsset } from "./FungibleAsset";

export class Option extends FungibleAsset {
    ticker: string;
    strike: number;
    option: 'Calls' | 'Puts';
    expiration: number;
    /**
     * @description The constructor for the Options class
     * @param t The ticker of the stock. The ticker must include the '$'
     * @param a Number of Shares of stock being transfered. Must be a positive amount
     * @param o The type of option: 'Calls' or 'Puts'
     * @param s The strike price of the option
     */
    constructor(t: string, a: number, o: 'Calls' | 'Puts', s: number){
        assert(t.charAt(0) == '$', 'Your ticker requires a ticker symbol ($)'); // Check to make sure t is a proper ticker
        assert(a > 0, 'The amount of shares must be a positive value'); // Check to make sure a is a positive number
        assert(a % 1 === 0, 'The amount of shares must be a whole number value'); // Check to make sure a is a whole number
        assert(s > 0, 'The strike price of the option you are trying to purchase is 0. This may mean the stock does not exist');
        t = t.toUpperCase()
        super(`${t}-${o}@${s}`, a, 'Option'); // UUID of option
        this.ticker = t;
        this.option = o;
        this.strike = s;
        this.expiration = -1;
    }
    /**
     * @description Static function used to get the name of the option asset given the parameters that make it unique
     * @param t The ticker of the option. The ticker must include the '$'
     * @param o The type of option: 'Calls' or 'Puts'
     * @param s The strike price of the option
     * 
     * @returns Theoredical asset name of the option
     */
    static getOptionName(t: string, o: 'Calls' | 'Puts', s: number): string{
        assert(t.charAt(0) == '$', 'Your ticker requires a ticker symbol ($)'); // Check to make sure t is a proper ticker
        return `${t}-${o}@${s}`;
    }
}