import EconomyParticipant from "./EconomyParticipant";
import Token from "./Asset/Token";
import Asset from "./Asset/Asset";
import Stock from "./Asset/Stock";

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

describe('Adding, and Removing assets', () => {

    beforeEach(() => {
        EconomyParticipant.addedIDs = []
    })

    test('Test 1: Add a token a user does not already have', () => {
        let token = new Token('test token', 10);
        let participant = new EconomyParticipant("abc");
        participant.addAsset(token);
        expect(participant.assets[token.name].amount).toEqual(token.amount)
    })


    test('Test 2: Add a token a user already has', () => {
        
        let tokenA = new Token('test token', 10);
        let tokenB = new Token('test token', 20);

        let participant = new EconomyParticipant("abc");

        participant.addAsset(tokenA);

        let tokenSpy = jest.spyOn(participant.assets[tokenA.name], 'add');

        participant.addAsset(tokenB);
        expect(tokenSpy).toBeCalledTimes(1)
        expect(participant.assets['test token'].amount).toEqual(30)
    })

    test('Add an asset that a user does not have', () => {
        let token = new Asset('test token', 10, 'Token');
        let participant = new EconomyParticipant("abc");
        participant.addAsset(token);
        expect(participant.assets).toEqual({'test token': token})
    })

    test('Remove a token that a user does not have', () => {
        let token = new Token('test token', 10);
        let participant = new EconomyParticipant("abc");
        participant.addAsset(token);
        expect(participant.assets).toEqual({'test token': token})
        expect(() => {
            participant.removeAsset(new Token('invalid', 10));
        }).toThrow()
    })

    test('Remove a stock that a user has', () => {
        let stockA = new Stock('$bb', 100);
        let stockB = new Token('$bb', 100);
        let participant = new EconomyParticipant("abc");
        participant.addAsset(stockA);
        participant.removeAsset(stockB);
        expect(participant.assets[stockA.name].amount).toEqual(0);
    })

}) 

