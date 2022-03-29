import assert from "assert";
import FungibleAsset from "./FungibleAsset";

export default class Token extends FungibleAsset {

    /**
     * @description The constructor for the Token class
     * @param n Name of the token, must not contain a ($)
     * @param a Amount of the token being transfered, must be a positive value.
     */
    constructor(n: string, a: number){
        assert(!n.includes('$'), 'The token cannot have a ($) in the name')
        assert(a >= 0, 'The token amount must be a positive value'); // Check to make sure a is a positive number
        super(n, a, 'Token');
    }

}