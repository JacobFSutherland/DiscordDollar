import { Transaction } from "../../BlockData";
import Block from "../../BlockData/Block/Block";
import { BlockGuess } from "../../BlockData/Block/BlockGuess";
import { DiscordCaptcha } from "../../BlockData/Captcha/DiscordCaptcha";
import Token from "../../BlockData/FungibleAssets/Token";
import BlockController from "./BlockController";


describe('Test Block Controller', () => {

    test('Create BlockController and make sure all assets are set properly', () => {
        let captcha = new DiscordCaptcha();
        let block = new Block(captcha);
        let blockController = new BlockController('Test Coin', block);

        let transferSpy = jest.spyOn(blockController, 'transferPendingToSubmitBlock');
        let transactionAdded = jest.spyOn(block, 'addTransaction');

        let incorrectSolution = new BlockGuess("abc", 'tester1');
        let correctSolution = new BlockGuess(captcha.value(), 'tester2');
        let t = new Transaction('reciever', new Token('Test', 10), 'sender');

        blockController.addTransaction(t);
        blockController.addTransaction(t);
        blockController.addTransaction(t);
        
        expect(transferSpy).toBeCalledTimes(0);
        
        blockController.isCorrectSolution(incorrectSolution);
        
        expect(transferSpy).toBeCalledTimes(0);
        
        blockController.isCorrectSolution(correctSolution);
        
        expect(transferSpy).toBeCalledTimes(1);
        expect(transactionAdded).toBeCalledTimes(4);
    })

    test('Overflow queue', () => {
        let captcha = new DiscordCaptcha();
        let block = new Block(captcha);
        let blockController = new BlockController('Test Coin', block);

        let transferSpy = jest.spyOn(blockController, 'transferPendingToSubmitBlock');
        let blockAdded = jest.spyOn(block, 'addTransaction');

        let incorrectSolution = new BlockGuess("abc", 'tester1');
        let correctSolution = new BlockGuess(captcha.value(), 'tester2');

        for(let i = 0; i < 30; i++){
            let token = new Token('Tester', 100)
            let t = new Transaction('reciever', token, 'sender');
            blockController.addTransaction(t);
        }


        expect(transferSpy).toBeCalledTimes(0);
        blockController.isCorrectSolution(incorrectSolution);
        expect(transferSpy).toBeCalledTimes(0);
        expect(blockAdded).toBeCalledTimes(0);
        expect(blockController.getPendingLength()).toEqual(30)

        blockController.isCorrectSolution(correctSolution);
        expect(transferSpy).toBeCalledTimes(1);
        expect(blockAdded).toBeCalledTimes(20);
        expect(blockController.getPendingLength()).toEqual(11)
    })

})