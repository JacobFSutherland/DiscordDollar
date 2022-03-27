import Token from "./Token";

describe('Test Constructor', () => {

    test("Test 1: Check positive token requirement", () => {
        expect(() => new Token('testToken', -5)).toThrow()
        expect(() => new Token('testToken', 5)).not.toThrow()
    })

})