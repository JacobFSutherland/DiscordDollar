export default class Medium {
  type: string;
  callerType: string;

  /**
   * 
   * @param t The type of object being used in the transaction 
   * @param c The type of object calling this super class
   */
  constructor(t: string, c: string) {
    this.type = t;
    this.callerType = c; 
  }
}
