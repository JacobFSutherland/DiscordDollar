import Stock from "./Asset/Stock";
import Token from "./Asset/Token";
import Option from "./Asset/Option";
import TSMap from "./TSMap";
import assert from "assert";
import Asset from "./Asset/Asset";

export default class EconomyParticipant{
    static addedIDs: string[] = [];
    discordID: string;
    assets: TSMap<Asset>;

    /**
     * 
     * @param id The ID of the Discord user that is being initialized as an economy participant
     */
    constructor(id: string){
        assert(!EconomyParticipant.addedIDs.includes(id), 'Duplicate Economy Participant');
        EconomyParticipant.addedIDs.push(id);
        this.discordID = id; 
        this.assets = {};
    }

    /**
     * 
     * @param asset The asset being added to the Discord user. 
     */
    addAsset(asset: Asset){
        if(this.assets[asset.name]){ 
            this.assets[asset.name].add(asset); // if the asset exists within the user's known asset balances, the sums are totaled and updated accordingly.
        }else{
            this.assets[asset.name] = new Token(asset.name, asset.amount); // if the asset does not exist within the user's known token balances, the asset is cloned and set.
        }//if
    } //addToken

    /**
     * 
     * @param asset The asset being subtracted from the Discord user. 
     */
    removeAsset(asset: Asset){
        assert(this.assets[asset.name], `Asset not found in user ${this.discordID}`);
        this.assets[asset.name].remove(asset); // if the asset exists within the user's known asset balances, the sums are totaled and updated accordingly.
    }

}