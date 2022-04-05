import { Option } from "../src";

describe('Test Constructor', () => {

    test("Test 1: Make sure default constructor works", () => {
        let option = new Option("$ticker", 5, "Calls", 5.50);
        expect(option.name).toEqual(Option.getOptionName('$TICKER', "Calls", 5.50));
    })

    test("Test 2: Check $ requirement", () => {
        expect(() => new Option('badticker', 5, 'Calls', 5.50)).toThrow()
    })

    test("Test 3: Check share amount requirements", () => {
        expect(() => new Option('$goodticker', 5.3, 'Calls', 5.50)).toThrow()
        expect(() => new Option('$goodticker', -7, 'Calls', 5.50)).toThrow()
    })

    test("Test 4: Check strike requirements", () => {
        expect(() => new Option('$goodticker', 1, 'Calls', -0.0)).toThrow()
        expect(() => new Option('$goodticker', 2, 'Calls', -3)).toThrow()
    })

})