import Medium from "../Medium";

export default class ChangeNickname extends Medium{
    nickname: string;
    /**
     * 
     * @param n The nickname being changed to
     */
    constructor(n: string){
        super('ChangeNickname');
        this.nickname = n;
    }
}