import {Memory} from './memory';

class CPU {
    memory: Memory;
    programCounter: number;

    constructor(memory: Memory) {
        this.memory = memory;
        this.programCounter = 0;
    }

    runCycle() {

    }

    interpretCode() {
        
    }
}