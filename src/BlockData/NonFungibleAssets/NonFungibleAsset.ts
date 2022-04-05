import {v4 as uuidv4} from 'uuid';
import Medium from "../Medium";

export class NonFungibleAsset extends Medium {
    id: string;
    constructor(s: string){
        super(s, 'NonFungibleAsset');
        this.id = uuidv4();
    }
}