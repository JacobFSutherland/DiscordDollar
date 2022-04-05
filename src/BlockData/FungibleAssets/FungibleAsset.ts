import assert from "assert";
import Medium from "../Medium";


export class FungibleAsset extends Medium {

    name: string;
    amount: number;
    /**
     * 
     * @param n Name of the asset
     * @param a Amount of the asset being transfered, must be a positive value.
     * @param t The asset's Type
     */
    constructor(n: string, a: number, t: string){
        assert(a > 0, 'The Asset amount must be a positive value'); // Check to make sure a is a positive number
        super(t, 'FungibleAsset');
        this.name = n;
        this.amount = a;
    }

    /**
     * 
     * @param asset The asset being added
     */
    add(asset: FungibleAsset) {
        assert(asset.type === this.type, 'The assets must be the same type when performing an adition');
        assert(asset.name === this.name, 'The assets must be the same asset when performing an adition'); // Check to make sure they are the same token
        this.amount += asset.amount;
        asset.amount = 0;
    }

    /**
     * 
     * @param asset The asset being subtracted
     */
    remove(asset: FungibleAsset) {
        assert(asset.type === this.type, 'The assets must be the same type when performing a subtraction')
        assert(asset.name === this.name, 'The assets must be the same asset when performing a subtraction'); // Check to make sure they are the same asset
        assert(this.amount - asset.amount >= 0, 'Cannot subtract, not enough assets to subtract'); // Check to make sure they are the same asset
        this.amount -= asset.amount;
        asset.amount = 0;
    }
}