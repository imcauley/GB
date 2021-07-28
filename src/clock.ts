export class Clock {
    onHighs: [() => void];
    onLows: [() => void];
    
    onHigh(func: () => void) {
        this.onHighs.push(func);
    }

    onLow(func: () => void) {
        this.onLows.push(func);
    }
}