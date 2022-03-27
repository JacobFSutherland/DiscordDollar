import assert from "assert";
import Medium from "../Medium";

export default class Stock extends Medium {
    ticker: string;
    amount: number;
    /**
     * 
     * @param t The ticker of the stock. The ticker must include the '$'
     * @param a Number of Shares of stock being transfered. Must be a positive amount
     */
    constructor(t: string, a: number){
        assert(t.charAt(0) == '$', 'Your ticker requires a ticker symbol ($)'); // Check to make sure t is a proper ticker
        assert(a > 0, 'The amount of shares must be a positive value'); // Check to make sure a is a positive number
        assert(a % 1 === 0, 'The amount of shares must be a whole number value'); // Check to make sure a is a whole number
        super('Stock');
        this.ticker = t;
        this.amount = a;
    }
}