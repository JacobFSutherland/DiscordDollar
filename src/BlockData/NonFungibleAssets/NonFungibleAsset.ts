import assert from "assert";
import Medium from "../Medium";
import {v4 as uuidv4} from 'uuid';

export default class NonFungibleAsset extends Medium {
    id: string;
    constructor(s: string){
        super(s, 'NonFungibleAsset');
        this.id = uuidv4();
    }
}