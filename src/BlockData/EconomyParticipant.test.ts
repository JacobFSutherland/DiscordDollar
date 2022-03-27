import EconomyParticipant from "./EconomyParticipant";
import Token from "./Goods/Token";

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

describe('Adding, and Removing Tokens', () => {

    beforeEach(() => {
        EconomyParticipant.addedIDs = []
    })

    test('Test 1: Add a token a user does not already have', () => {
        let token = new Token('test token', 10);
        let participant = new EconomyParticipant("abc");
        participant.addToken(token);
        expect(participant.tokens[token.name].amount).toEqual(token.amount)
    })


    test('Test 2: Add a token a user already has', () => {
        
        let tokenA = new Token('test token', 10);
        let tokenB = new Token('test token', 20);

        let participant = new EconomyParticipant("abc");

        participant.addToken(tokenA);

        let tokenSpy = jest.spyOn(participant.tokens[tokenA.name], 'add');

        participant.addToken(tokenB);
        expect(tokenSpy).toBeCalledTimes(1)
        expect(participant.tokens['test token'].amount).toEqual(30)
    })

    test('Remove a token that a user has', () => {
        let token = new Token('test token', 10);
        let participant = new EconomyParticipant("abc");
        participant.addToken(token);
        expect(participant.tokens).toEqual({'test token': token})
    })

    test('Remove a token that a user does not have', () => {
        let token = new Token('test token', 10);
        let participant = new EconomyParticipant("abc");
        participant.addToken(token);
        expect(participant.tokens).toEqual({'test token': token})
        expect(() => {
            participant.removeToken(new Token('invalid', 10));
        }).toThrow()
    })

    test('Remove a token that a user has', () => {
        let tokenA = new Token('test token', 100);
        let tokenB = new Token('test token', 100);
        let participant = new EconomyParticipant("abc");
        participant.addToken(tokenA);
        participant.removeToken(tokenB);
        expect(participant.tokens[tokenA.name].amount).toEqual(0);
    })

}) 

