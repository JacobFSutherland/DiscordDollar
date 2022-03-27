import Service from "./Service";

export default class Sound extends Service{
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