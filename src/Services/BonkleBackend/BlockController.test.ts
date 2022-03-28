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
        let blockAdded = jest.spyOn(block, 'addTransaction');

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
        expect(blockAdded).toBeCalledTimes(4);
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
            let t = new Transaction('reciever', new Token('Test', 100), 'sender');
            blockController.addTransaction(t);
        }
        expect(transferSpy).toBeCalledTimes(0);
        blockController.isCorrectSolution(incorrectSolution);
        expect(transferSpy).toBeCalledTimes(0);
        blockController.isCorrectSolution(correctSolution);
        expect(transferSpy).toBeCalledTimes(1);
        expect(blockAdded).toBeCalledTimes(20);
    })

})