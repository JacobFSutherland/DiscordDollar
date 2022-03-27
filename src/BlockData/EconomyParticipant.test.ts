import EconomyParticipant from "./EconomyParticipant";
import Token from "./FungibleAssets/Token";
import FungibleAsset from "./FungibleAssets/FungibleAsset";
import Stock from "./FungibleAssets/Stock";
import NFT from "./NonFungibleAssets/NFT";

describe('Test Economy Participant Static Values', () => {

    beforeEach(() => {
        EconomyParticipant.addedIDs = []
    })

    test("Create a new participant", () => {
        let participant = new EconomyParticipant("abc");
        expect(EconomyParticipant.addedIDs).toEqual(["abc"]);
    })

    test('Reject duplicate participants', () => {
        expect(
            () => { 
                new EconomyParticipant("abc");
                new EconomyParticipant("abc");
            }
        ).toThrow('Duplicate Economy Participant');
    })

})

describe('Adding, and Removing Fungible Assets', () => {

    beforeEach(() => {
        EconomyParticipant.addedIDs = []
    })

    test('Test 1: Add a token a user does not already have', () => {
        let token = new Token('test token', 10);
        let participant = new EconomyParticipant("abc");
        participant.addFungibleAsset(token);
        expect(participant.fungibleAssets[token.name].amount).toEqual(token.amount)
    })


    test('Test 2: Add a token a user already has', () => {
        
        let tokenA = new Token('test token', 10);
        let tokenB = new Token('test token', 20);

        let participant = new EconomyParticipant("abc");

        participant.addFungibleAsset(tokenA);

        let tokenSpy = jest.spyOn(participant.fungibleAssets[tokenA.name], 'add');

        participant.addFungibleAsset(tokenB);
        expect(tokenSpy).toBeCalledTimes(1)
        expect(participant.fungibleAssets['test token'].amount).toEqual(30)
    })

    test('Add an asset that a user does not have', () => {
        let token = new FungibleAsset('test token', 10, 'Token');
        let participant = new EconomyParticipant("abc");
        participant.addFungibleAsset(token);
        expect(participant.fungibleAssets).toEqual({'test token': token})
    })

    test('Remove a token that a user does not have', () => {
        let token = new Token('test token', 10);
        let participant = new EconomyParticipant("abc");
        participant.addFungibleAsset(token);
        expect(participant.fungibleAssets).toEqual({'test token': token})
        expect(() => {
            participant.removeFungibleAsset(new Token('invalid', 10));
        }).toThrow()
    })

    test('Remove a stock that a user has', () => {
        let stockA = new Stock('$bb', 100);
        let stockB = new Stock('$bb', 100);
        let participant = new EconomyParticipant("abc");
        participant.addFungibleAsset(stockA);
        participant.removeFungibleAsset(stockB);
        expect(participant.fungibleAssets[stockA.name].amount).toEqual(0);
    })

}) 

describe("Adding and removing non-fungible assets", () => {

    test('Test 1: Add an NFT to a user', () => {
        let nft = new NFT();
        let participant = new EconomyParticipant("user");
        participant.addNonFungibleAsset(nft);
        expect(participant.nonFungibleAssets[nft.id]).toEqual(nft)
    })

    test('Test 2: Add and remove NFT from a user', () => {
        let nft = new NFT();
        let participant = new EconomyParticipant("user5");
        participant.addNonFungibleAsset(nft);
        participant.removeNonFungibleAsset(nft);
        expect(participant.nonFungibleAssets[nft.id]).toBeUndefined()
    })

    test('Test 2: Remove an NFT a user does not have', () => {
        let nft = new NFT();
        let participant = new EconomyParticipant("user2");
        expect(() => participant.removeNonFungibleAsset(nft)).toThrowError()
    })

})

