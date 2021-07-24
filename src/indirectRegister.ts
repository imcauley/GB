import {Register} from './register';
import {BitOperations} from './bitOperations';
import { Memory } from './memory';

export class IndirectRegister extends Register {
    high: Register;
    low: Register;
    mem: Memory;

    constructor(memory: Memory, high?: Register, low?: Register) {
        super();
        this.mem = memory;

        if(high && low) {
            this.high = high;
            this.low = low;
        }
        else {
            this.high = new Register();
            this.low = new Register();
        }
    }

    get() {
        const address = BitOperations.convertToWord(this.high.get(), this.low.get());
        return this.mem.getByte(address);
    }

    set(value: number) {
        const address = BitOperations.convertToWord(this.high.get(), this.low.get());
        this.mem.setByte(address, value);
    }
}