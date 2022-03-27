import assert from "assert";
import Asset from "./Asset";

export default class Token extends Asset {

    /**
     * 
     * @param n Name of the token
     * @param a Amount of the token being transfered, must be a positive value.
     */
    constructor(n: string, a: number){
        assert(a > 0, 'The token amount must be a positive value'); // Check to make sure a is a positive number
        super(n, a, 'Token');
    }

}