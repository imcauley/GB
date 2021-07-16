export class Register {
    memory: Uint16Array;

    constructor() {
        this.memory = new Uint16Array(1);
    }

    get() {
        return this.memory[0];
    }

    set(value: number) {
        this.memory[0] = value & 0xFF;
    } 

    operation(op: (number) => number) {
        let sideEffects = {
            zeroResult: op(this.memory[0]) === 0,
            halfCarry: op(this.memory[0] & 0x0F) > 0x0F,
            fullCarry: op(this.memory[0]) > 0xFF,
        };

        this.set(op(this.memory[0]))
        return sideEffects;
    }
}