import {Register} from './register';

export class DoubleRegister extends Register {
    high: Register;
    low: Register;

    constructor(high: Register, low: Register) {
        super();
        this.high = high;
        this.low = low;
    }

    get() {
        return this.low.get();
    }

    set(value: number) {
        return this.low.set(value);
    }
}