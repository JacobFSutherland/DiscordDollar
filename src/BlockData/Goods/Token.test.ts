import Medium from '../Medium';
import Token from './Token';

jest.mock("../Medium");

describe('Test Token Constructor', () => {

    /**
     * Make sure all methods are being called, and token is being created as intended
     */
    test('Test 1: Create Regular Token', () => {
        let t = new Token("a", 10);
        expect(t.amount).toEqual(10);
        expect(t.name).toEqual("a");
        expect(Medium).toBeCalledTimes(1);
    })

    /**
    * Make sure token is being rejected if it has a negative value
    */

    test('Test 2: Create Invalid Token', () => {
        expect(
            () => new Token('b', -10)
        ).toThrow('The token amount must be a positive value')
    })

})

describe('Test Token Functions', () => {
    let t1: Token;
    let t2: Token;

    /**
    * Make 2 tokens are being added together
    */

    test('Test 1: Add 2 tokens together', () => {
        t1 = new Token("a", 10);
        t2 = new Token("a", 100);

        const t1AddSpy = jest.spyOn(t1, 'add');
        const t2AddSpy = jest.spyOn(t2, 'add');

        t1.add(t2);
        // Test initial add function
        expect(t1AddSpy).toBeCalledTimes(1)
        expect(t1AddSpy).toBeCalledWith(t2);
        expect(t2AddSpy).toBeCalledTimes(0);

        // Test Post Conditions
        expect(t1.amount).toEqual(110);
        expect(t2.amount).toEqual(0);
    })

    /**
    * Make sure invalid tokens being added throws an error
    */

    test('Test 2: Add 2 invalid tokens together', () => {
        t1 = new Token("a", 10);
        t2 = new Token("b", 100);

        // Test initial add function
        expect(() => t1.add(t2)).toThrow('The tokens must be the same token when performing an adition');

        // Test Post Conditions
        expect(t1.amount).toEqual(10);
        expect(t2.amount).toEqual(100);
    })

   /**
    * Make sure subtracting tokens works as intended, IE: for values >= 0
    */

    test('Test 3: Subtract 2 tokens together', () => {
        t1 = new Token("a", 10);
        t2 = new Token("a", 10);

        const t1Remove = jest.spyOn(t1, 'remove');
        const t2Remove = jest.spyOn(t2, 'remove');

        t1.remove(t2);
        // Test remove function
        expect(t1Remove).toBeCalledTimes(1)
        expect(t1Remove).toBeCalledWith(t2);
        expect(t2Remove).toBeCalledTimes(0)

        // Test Post Conditions
        expect(t1.amount).toEqual(0);
        expect(t2.amount).toEqual(0);
    })

    test('Test 4: Subtract 2 tokens together with the resultant to be negative', () => {
        t1 = new Token("a", 10);
        t2 = new Token("a", 10.01);

        expect(() => t1.remove(t2)).toThrow("Cannot subtract, not enough tokens to subtract");

        // Test Post Conditions
        expect(t1.amount).toEqual(10);
        expect(t2.amount).toEqual(10.01);
    })

    test('Test 5: Subtract 2 tokens together with different names', () => {
        t1 = new Token("a", 10);
        t2 = new Token("b", 100);

        expect(() => t2.remove(t1)).toThrow("The tokens must be the same token when performing a subtraction");

        // Test Post Conditions
        expect(t1.amount).toEqual(10);
        expect(t2.amount).toEqual(100);
    })
})