import TSMap from "./TSMap";
import assert from "assert";
import FungibleAsset from "./Fungible/FungibleAsset";

export default class EconomyParticipant{
    static addedIDs: string[] = [];
    discordID: string;
    fungibleAssets: TSMap<FungibleAsset>;

    /**
     * @description Creates a new EconomyParticipant only if the ID passed is unique
     * @param id The ID of the Discord user that is being initialized as an economy participant
     */
    constructor(id: string){
        assert(!EconomyParticipant.addedIDs.includes(id), 'Duplicate Economy Participant');
        EconomyParticipant.addedIDs.push(id);
        this.discordID = id; 
        this.fungibleAssets = {};
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
        assert(this.fungibleAssets[asset.name], `Asset not found in user ${this.discordID}`);
        this.fungibleAssets[asset.name].remove(asset); // if the asset exists within the user's known asset balances, the sums are totaled and updated accordingly.
    }

}