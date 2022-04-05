import { Block, DiscordCaptcha, Token, Transaction } from "../src";



describe('Test Block Functions', () => {

    test('test correct answer', () => {
        let captcha = new DiscordCaptcha();
        let b = new Block(captcha);
        let wrongGuess = 'abc'
        let correctGuess = captcha.value();
        expect(b.checkAnswer(wrongGuess)).toBe(false);
        expect(b.reward).toBe(-1);
    
        expect(b.checkAnswer(correctGuess)).toBe(true);
        expect(b.reward).toBeCloseTo(0);
    })

    test('test addedTransaction', () => {
        let captcha = new DiscordCaptcha();
        let b = new Block(captcha);
        let transaction = new Transaction('reciever', new Token('test', 10), 'sender');
        b.addTransaction(transaction);
        expect(b.getTransactions()).toContain(transaction);
    })
})