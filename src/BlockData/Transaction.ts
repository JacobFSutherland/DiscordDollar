import { FungibleAsset } from "./FungibleAssets";
import { NonFungibleAsset } from "./NonFungibleAssets";
import { Service } from "./Services";

// Transaction class used for tracking transactions on the ledger
export class Transaction {
    reciver: string;
    medium: FungibleAsset | NonFungibleAsset | Service;
    sender: string;

    /**
     * 
     * @param r DiscordID of the reciever of the medium
     * @param m The goods or service being transfered
     * @param s DiscordID of the sender of the medium
     */
    constructor(r: string, m: FungibleAsset | NonFungibleAsset | Service, s: string ){
        this.reciver = r;
        this.medium = m;
        this.sender = s;

    }
}
