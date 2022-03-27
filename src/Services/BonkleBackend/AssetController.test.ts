import AssetController from "./AssetController";
import EconomyParticipant from "../../BlockData/EconomyParticipant";
import FungibleAsset from "../../BlockData/FungibleAssets/FungibleAsset";
import NFT from "../../BlockData/NonFungibleAssets/NFT";
import NonFungibleAsset from "../../BlockData/NonFungibleAssets/NonFungibleAsset";

jest.mock("../../BlockData/EconomyParticipant");

describe('Test Constructor', () => {

    let a: AssetController = new AssetController();

    beforeEach(() => EconomyParticipant.addedIDs = []);

    test("Test 1: Make sure a new economy participant is being created when an asset is sent to a new user", () => {
        jest.mock("../../BlockData/EconomyParticipant");
        let asset = new FungibleAsset('test asset', 10, "Asset");
        let asset2 = new FungibleAsset('test asset 2', 1, "Asset");
        a.addAsset("new user", asset);
        a.addAsset("new user", asset2);
        expect(EconomyParticipant).toBeCalledTimes(1);
    })

    test("Test 2: Make sure a new economy participant is being created when an asset is sent to a new user each time", () => {
        let asset = new FungibleAsset('test asset', 10, "Asset");
        let asset2 = new FungibleAsset('test asset 2', 1, "Asset");
        a.addAsset("new user 1", asset);
        a.addAsset("new user 2", asset2);
        expect(EconomyParticipant).toBeCalledTimes(2);
    })

    test("Test 3: Make sure an economy participant is not created twice when adding assets", () => {
        let asset = new FungibleAsset('test asset', 10, "Asset");
        let asset2 = new NFT();
        a.addAsset("new user 3", asset);
        a.addAsset("new user 3", asset2);
        expect(EconomyParticipant).toBeCalledTimes(1);
    })

    test("Test 4: Make sure a new user is created when removing an asset from a user that does not exist", () => {
        let asset2 = new FungibleAsset('test asset', 1, "Asset");
        a.remAsset("super new user 1", asset2);
        expect(EconomyParticipant).toBeCalledTimes(1);
    })

    test("Test 6: add and remove a non-fungible and fungible asset", () => {
        let asset1 = new FungibleAsset('test asset', 1, "Asset");
        let asset2 = new NonFungibleAsset("asset");
        a.addAsset("addAndRemoveUser" , asset1);
        a.addAsset("addAndRemoveUser", asset2);
        a.remAsset("addAndRemoveUser" , asset1);
        a.remAsset("addAndRemoveUser", asset2);
        expect(a.userAssets["addAndRemoveUser"].addFungibleAsset).toBeCalledTimes(1)
        expect(a.userAssets["addAndRemoveUser"].addNonFungibleAsset).toBeCalledTimes(1)
        expect(a.userAssets["addAndRemoveUser"].removeFungibleAsset).toBeCalledTimes(1)
        expect(a.userAssets["addAndRemoveUser"].removeNonFungibleAsset).toBeCalledTimes(1)
    })

})