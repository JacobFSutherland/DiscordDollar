import { Microservice, Token, Transaction } from "../src";


describe('Test microservice endpoints', () => {

    const microservice = new Microservice('http://localhost:3000');

    test('Test get user', () => {
        
        expect(() => {microservice.getUser('287800801152466944')}).not.toThrow()
        expect(() => {microservice.getUser('nonexistentuser')}).toThrow()

    })

    test('test addTransaction', () => {

        expect(() => {microservice.addTransaction(new Transaction('287800801152466944', new Token('Test Token', 5000), 'BLOCK_REWARD'))}).not.toThrow()
        expect(() => {microservice.addTransaction(new Transaction('287800801152466944', new Token('Test Token', 5000), 'Herbie'))}).toThrow()

    })
})