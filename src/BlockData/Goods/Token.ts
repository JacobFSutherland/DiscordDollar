import { assert } from "console";
import Medium from "../Medium";

export default class Token extends Medium {
    name: string;
    amount: Number;
    /**
     * 
     * @param n Name of the token
     * @param a Amount of the token being transfered, must be a positive value.
     */
    constructor(n: string, a: Number){
        assert(a > 0, 'The token amount must be a positive value'); // Check to make sure a is a positive number
        super('Token');
        this.name = n;
        this.amount = a;
    }
}