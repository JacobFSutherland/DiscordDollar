import FungibleAsset from "../../BlockData/Fungible/FungibleAsset";
import EconomyParticipant from "../../BlockData/EconomyParticipant";
import TSMap from "../../BlockData/TSMap";

export default class AssetControler{
    userAssets: TSMap<EconomyParticipant>;

    constructor(){
        this.userAssets = {}
    }

    /**
     * @description Adds an asset to user. if the user does not have any assets, a new EconomyParticipant will be automatically created and set.
     *  
     * @param u The DiscordID of the user you are adding the asset to
     * @param a The Asset you are adding to the user
     */
    addAsset(u: string, a: FungibleAsset){
        // If the participant recieving the asset does not exist, create a new participant for that user.
        if(!this.userAssets[u]){
            this.userAssets[u] = new EconomyParticipant(u);
        }
        this.userAssets[u].addFungibleAsset(a);
    }

    /**
     * @description Removes an asset from a user. if the user does not have any assets, a new EconomyParticipant will be automatically created and set.
     *  
     * @param u The DiscordID of the user you are adding the asset to
     * @param a The Asset you are adding to the user
     */

     remAsset(u: string, a: FungibleAsset){
        // If the participant recieving the asset does not exist, create a new participant for that user.
        if(!this.userAssets[u]){
            this.userAssets[u] = new EconomyParticipant(u);
        }
        this.userAssets[u].removeFungibleAsset(a);
    }

}