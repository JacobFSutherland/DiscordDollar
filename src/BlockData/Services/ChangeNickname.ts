import Service from "./Service";

export default class ChangeNickname extends Service{
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