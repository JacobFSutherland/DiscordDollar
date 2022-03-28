import FungibleAsset from "../../BlockData/FungibleAssets/FungibleAsset";
import EconomyParticipant from "../../BlockData/EconomyParticipant";
import TSMap from "../../BlockData/TSMap";
import NonFungibleAsset from "../../BlockData/NonFungibleAssets/NonFungibleAsset";


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
    addAsset(u: string, a: FungibleAsset | NonFungibleAsset){
        // If the participant recieving the asset does not exist, create a new participant for that user.
        if(!this.userAssets[u]){
            this.userAssets[u] = new EconomyParticipant(u);
        }
        (a instanceof FungibleAsset)?
            this.userAssets[u].addFungibleAsset(a):
            this.userAssets[u].addNonFungibleAsset(a);
    }


    /**
     * @description Removes an asset from a user. if the user does not have any assets, a new EconomyParticipant will be automatically created and set.
     *  
     * @param u The DiscordID of the user you are adding the asset to
     * @param a The Asset you are adding to the user
     */

    remAsset(u: string, a: FungibleAsset | NonFungibleAsset){
        // If the participant recieving the asset does not exist, create a new participant for that user.
        if(!this.userAssets[u]){
            this.userAssets[u] = new EconomyParticipant(u);
        }
        if(a.callerType === 'FungibleAsset'){
            this.userAssets[u].removeFungibleAsset(a as FungibleAsset);
        }else{
            this.userAssets[u].removeNonFungibleAsset(a as NonFungibleAsset);
        }
    }
}