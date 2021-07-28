export class Clock {
    onHighs: [() => void];
    onLows: [() => void];
    
    onHigh(func: () => void) {
        this.onHighs.push(func);
    }

    onLow(func: () => void) {
        this.onLows.push(func);
    }

    start(shouldStop: () => boolean) {
        while(!shouldStop) {
            // Go High
            setTimeout(() => {
                for (const func of this.onHighs) {
                    func();
                }
            }, 1000)

            // Go Low
            setTimeout(() => {
                for (const func of this.onLows) {
                    func();
                }
            }, 1000)
        }
    }
}