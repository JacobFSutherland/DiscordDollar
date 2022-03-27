import assert from "assert";
import Medium from "../Medium";

export default class Token extends Medium {

    name: string;
    amount: number;
    /**
     * 
     * @param n Name of the token
     * @param a Amount of the token being transfered, must be a positive value.
     */
    constructor(n: string, a: number){
        assert(a > 0, 'The token amount must be a positive value'); // Check to make sure a is a positive number
        super('Token');
        this.name = n;
        this.amount = a;
    }

    /**
     * 
     * @param token The token being added
     */
    add(token: Token) {
        assert(token.name === this.name, 'The tokens must be the same token when performing an adition'); // Check to make sure they are the same token
        this.amount += token.amount;
        token.amount = 0;
    }


    /**
     * 
     * @param token The token being subtracted
     */
    remove(token: Token) {
        assert(token.name === this.name, 'The tokens must be the same token when performing a subtraction'); // Check to make sure they are the same token
        assert(this.amount - token.amount >= 0, 'Cannot subtract, not enough tokens to subtract'); // Check to make sure they are the same token
        this.amount -= token.amount;
        token.amount = 0;
    }
}