import TSMap from "./TSMap";
import assert from "assert";
import FungibleAsset from "./FungibleAssets/FungibleAsset";
import NonFungibleAsset from "./NonFungibleAssets/NonFungibleAsset";

export default class EconomyParticipant{
    static addedIDs: string[] = [];
    private static negativeBalAllowed: string[] = ['BLOCK_REWARD'];
    discordID: string;
    fungibleAssets: TSMap<FungibleAsset>;
    nonFungibleAssets: TSMap<NonFungibleAsset>;

    /**
     * @description Creates a new EconomyParticipant only if the ID passed is unique
     * @param id The ID of the Discord user that is being initialized as an economy participant
     */
    constructor(id: string){
        assert(!EconomyParticipant.addedIDs.includes(id), 'Duplicate Economy Participant');
        EconomyParticipant.addedIDs.push(id);
        this.discordID = id; 
        this.fungibleAssets = {};
        this.nonFungibleAssets = {};
    }

    /**
     * @description Add a user, or admin id that will be allowed to have a negative balance
     * @param id The ID of the user you will allow to have a negative balance
     */
    static GiveAdminBal(id: string): void {
        EconomyParticipant.negativeBalAllowed.push(id);
    }

    /**
     * 
     * @description The users, or admin ids that are allowed to have a negative balance
     */
    static GetAdmins(): string[] {
        return EconomyParticipant.negativeBalAllowed;
    }
    



    /**
     * @description Assets of the same name are automatically added together
     * @param asset The asset being added to the Discord user. 
     */
    addNonFungibleAsset(asset: NonFungibleAsset){
        this.nonFungibleAssets[asset.id] = asset; // if the asset exists within the user's known asset balances, the sums are totaled and updated accordingly.
    } //addToken

    /**
     * @description Removes a non-fungible asset unless the user is a super user/administrator
     * @param asset The asset being subtracted from the Discord user. 
     */
    removeNonFungibleAsset(asset: NonFungibleAsset){
        assert(this.nonFungibleAssets[asset.id] != undefined || EconomyParticipant.negativeBalAllowed.includes(this.discordID), `Asset not found in user ${this.discordID}`);
        if(!EconomyParticipant.negativeBalAllowed.includes(this.discordID)) delete this.nonFungibleAssets[asset.id];
    }

    /**
     * @description Assets of the same name are automatically added together
     * @param asset The asset being added to the Discord user. 
     */
    addFungibleAsset(asset: FungibleAsset){
        if(this.fungibleAssets[asset.name]){ 
            this.fungibleAssets[asset.name].add(asset); // if the asset exists within the user's known asset balances, the sums are totaled and updated accordingly.
        }else{
            this.fungibleAssets[asset.name] = new FungibleAsset(asset.name, asset.amount, asset.type); // if the asset does not exist within the user's known token balances, the asset is cloned and set.
        }//if
    } //addToken

    /**
     * 
     * @param asset The asset being subtracted from the Discord user. 
     */
    removeFungibleAsset(asset: FungibleAsset){
        assert(this.fungibleAssets[asset.name] || EconomyParticipant.negativeBalAllowed.includes(this.discordID), `Asset not found in user ${this.discordID}`);
        this.fungibleAssets[asset.name].remove(asset); // if the asset exists within the user's known asset balances, the sums are totaled and updated accordingly.
    }//removeFungibleAsset

}