import Medium from "../Medium";

export default class Mute extends Medium{
    duration: number;

    constructor(){
        super('Mute');
        this.duration = 2;
        while(Math.random() > 0.5) this.duration *= 2; // Variable mute time
    }
}