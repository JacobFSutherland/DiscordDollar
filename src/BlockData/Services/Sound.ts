import Medium from "../Medium";

export default class Sound extends Medium{
    soundName: string;
    /**
     * 
     * @param s The name of the sound being played
     */
    constructor(s: string){
        super('Sound');
        this.soundName = s;
    }
}