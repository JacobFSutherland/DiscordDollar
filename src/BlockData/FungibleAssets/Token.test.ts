import Token from "./Token";

describe('Test Constructor', () => {

    test("Test 1: Check positive token requirement", () => {
        expect(() => new Token('testToken', -5)).toThrow()
        expect(() => new Token('testToken', 5)).not.toThrow()
    })

    test("Test 2: Check token name requirement", () => {
        expect(() => new Token('Ca$h', 5)).toThrow()
        expect(() => new Token('testToken', 5)).not.toThrow()
    })

})