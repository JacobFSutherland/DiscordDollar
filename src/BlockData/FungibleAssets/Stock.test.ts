import Stock from "./Stock";

describe('Test Constructor', () => {

    test("Test 1: Check $ requirement", () => {
        expect(() => new Stock('badticker', 5)).toThrow()
    })

    test("Test 2: Check share amount requirements", () => {
        expect(() => new Stock('$goodticker', 5.3)).toThrow()
        expect(() => new Stock('$goodticker', -7)).toThrow()
    })

    test("Test 3: Make ticker to Uppercase", () => {
        let s = new Stock('$ticker', 5)
        expect(s.name).toEqual('$TICKER');
    })

})