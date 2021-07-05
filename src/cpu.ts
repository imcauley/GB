import {Memory} from './memory';
import {Register} from './register';
import {DoubleRegister} from './doubleRegister';

class CPU {
    memory: Memory;
    registers: Register[];

    programCounter: number;

    PREFIX_BYTES = new Set([0xCB, 0xDD, 0xED, 0xFD])

    constructor(memory: Memory) {
        this.memory = memory;
        this.programCounter = 0;

        this.registers.push(new Register()); // B
        this.registers.push(new Register()); // C
        this.registers.push(new Register()); // D
        this.registers.push(new Register()); // E
        this.registers.push(new Register()); // H
        this.registers.push(new Register()); // L
        this.registers.push(new DoubleRegister(this.registers[4], this.registers[5])); // HL
        this.registers.push(new Register()); // A
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