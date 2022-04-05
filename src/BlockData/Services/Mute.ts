import { Service } from "./Service";

export class Mute extends Service{
    duration: number;

    constructor(){
        super('Mute');
        this.duration = 2;
        while(Math.random() > 0.5) this.duration *= 2; // Variable mute time
    }
}