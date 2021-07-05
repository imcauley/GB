import {Memory} from './memory';
import {Register} from './register';

class CPU {
    memory: Memory;
    registers = {
        B: new Register(),
        C: new Register(),
        D: new Register(),
        E: new Register(),
        H: new Register(),
        L: new Register(),
        A: new Register(),
    }

    programCounter: number;

    PREFIX_BYTES = new Set([0xCB, 0xDD, 0xED, 0xFD])

    constructor(memory: Memory) {
        this.memory = memory;
        this.programCounter = 0;
    }

    runCycle() {
        let opcode = 0x00;
        
        let currentByte = this.memory.getByte(this.programCounter);
        
        if(this.PREFIX_BYTES.has(currentByte)) {
            opcode = this.memory.getByte(this.programCounter + 0x08);
        }
        else {
            opcode = currentByte;
        }
    }

    interpretCode(opcode: number) {
    }

    opcodeElements(opcode: number) {
        return {
            x: (opcode & 0b11000000) >> 6,
            y: (opcode & 0b00111000) >> 3,
            z: (opcode & 0b00000111),
            P: (opcode & 0b00001000) >> 3,
            q: (opcode & 0b00110000) >> 4
        }
    }
}