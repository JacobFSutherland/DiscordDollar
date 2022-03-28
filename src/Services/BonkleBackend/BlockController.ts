import { Transaction } from "../../BlockData";
import Block from "../../BlockData/Block/Block";
import { BlockGuess } from "../../BlockData/Block/BlockGuess";
import Token from "../../BlockData/FungibleAssets/Token";

export default class BlockController{

    private pendingTransactions: Transaction[]
    private currentBlock: Block;
    private ocupied: boolean;
    private mineableTokenName: string

    constructor(mineableTokenName: string, block: Block){
        this.pendingTransactions = [];
        this.currentBlock = block;
        this.ocupied = false;
        this.mineableTokenName = mineableTokenName;

    }
    /**
     * @describe Move pending transactions to the block
     */
    transferPendingToSubmitBlock(){
        // Try to pop the next 19 pending transactions onto the block, if we catch, we know the queue is empty 
        for(let i = 0; i < 19; i++){
            // o(n) operation, but queue will likely be short so it should be fine
            let transaction = this.pendingTransactions.shift(); 
            // Add the next transaction in queue to the block
            if(transaction) this.currentBlock.addTransaction(transaction);
        }
    }

    /**
     * 
     * @param T The transaction to be added to the block
     */
    addTransaction(T: Transaction){
        // add transaction to pending
        this.pendingTransactions.push(T);
        
    }

    isCorrectSolution(guess: BlockGuess): boolean{
        if(!this.ocupied && this.currentBlock.checkAnswer(guess.solution)){
            this.ocupied = true; // Attempt was the answer, lock the block so nobody else can access it
            // Adding block reward transaction to the block
            this.currentBlock.addTransaction(new Transaction(guess.author, new Token(this.mineableTokenName, this.currentBlock.reward), 'BLOCK_REWARD'));
            
            // Fill block with transactions;
            this.transferPendingToSubmitBlock();
            return true;
        }
        return false;
    }


}