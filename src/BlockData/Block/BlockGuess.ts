export class BlockGuess {
    solution: string;
    author: string

    /**
     * @description The object used to encapsulate solutions to blocks
     * @param solution The attempted answer to the block captcha
     * @param author The discordID of the solution writer
     */
    constructor(solution: string, author: string){
        this.solution = solution;
        this.author = author;
    }

}