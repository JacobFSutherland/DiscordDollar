import EconomyParticipant from "../../BlockData/EconomyParticipant";
import TSMap from "../../BlockData/TSMap";

export default class AssetControler{
    userAssets: TSMap<EconomyParticipant>;

    constructor(){
        this.userAssets = {}
    }

}