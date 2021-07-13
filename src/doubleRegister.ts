import {Register} from './register';
import {BitOperations} from './bitOperations';

export class DoubleRegister extends Register {
    high: Register;
    low: Register;

    constructor(high?: Register, low?: Register) {
        super();
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
        return this.low.get() + (this.high.get() << 8);
    }

    set(value: number) {
        this.high.set(BitOperations.getHigh(value))
        this.low.set(BitOperations.getLow(value));
    }
}