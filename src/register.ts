export class Register {
    memory: Uint16Array;

    constructor() {
        this.memory = new Uint16Array(1);
    }

    get() {
        return this.memory[0];
    }

    set(value: number) {
        this.memory[0] = value;
    } 
}