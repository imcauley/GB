import {Memory} from './memory';
import {Register} from './register';
import {DoubleRegister} from './doubleRegister';
import { match, __} from 'ts-pattern';
import { StatusRegister } from './statusRegister';

export class CPU {
    memory: Memory;
    registers: Register[];
    statusRegister = new StatusRegister();
    stackPointer = new DoubleRegister();

    programCounter: number;

    PREFIX_BYTES = new Set([0xCB, 0xDD, 0xED, 0xFD]);

    constructor(memory: Memory) {
        this.memory = memory;
        this.programCounter = 0;

        this.registers = [];

        this.stackPointer.set(0xFFFE);

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
        let opcodeAddress = 0x00;

        const currentByte = this.memory.getByte(this.programCounter);
        
        if(this.PREFIX_BYTES.has(currentByte)) {
            opcodeAddress = this.programCounter + 0x08;
        }
        else {
            opcodeAddress = this.programCounter;
        }

        let opcode = this.memory.getByte(opcodeAddress);
        let byte2 = this.memory.getByte(opcodeAddress + 0x08);
        let byte3 = this.memory.getByte(opcodeAddress + 0x10);

        const bytesUsed = this.interpretCode(opcode, byte2, byte3);

        if(bytesUsed) {
            this.programCounter += (0x08 * bytesUsed);
        }   
    }

    interpretCode(opcode: number, byte2?: number, byte3?: number) {
        const opcodeFragment = this.opcodeElements(opcode);

        return match(opcodeFragment)
        .with({x: 0, z: 6}, () => {
            this.registers[opcodeFragment.y].set(byte2);
            return 2;
        })
        .with({x: 0, z: 4}, () => {
            // INC r
            let current = this.registers[opcodeFragment.y].get();
            this.registers[opcodeFragment.y].set(current + 1);
            return 1;
        })
        .with({x: 0, z: 5}, () => {
            // DEC r
            let current = this.registers[opcodeFragment.y].get();
            this.registers[opcodeFragment.y].set(current - 1);
            return 1;
        })
        .with({x: 2, y: 0}, () => {
            const r = this.registers[opcodeFragment.z].get();
            this.registers[7].operation((x: number) => {return x + r});
            return 1;
        })
        .with({x: 2, y: 2}, () => {
            const r = this.registers[opcodeFragment.z].get();
            this.registers[7].operation((x: number) => {return x - r});
            return 1;
        })
        .with({x: 2, y: 4}, () => {
            const r = this.registers[opcodeFragment.z].get();
            this.registers[7].operation((x: number) => {return x & r});
            return 1;
        })
        .with({x: 2, y: 5}, () => {
            const r = this.registers[opcodeFragment.z].get();
            this.registers[7].operation((x: number) => {return x ^ r});
            return 1;
        })
        .with({x: 2, y: 6}, () => {
            const r = this.registers[opcodeFragment.z].get();
            this.registers[7].operation((x: number) => {return x | r});
            return 1;
        })
        .with({x: 3, z: 3, y: 0}, () => {
            // JP nn
            this.programCounter = byte2;
            return 0;
        })
        .run()
    }

    opcodeElements(opcode: number) {
        return {
            x: (opcode & 0b11000000) >> 6,
            y: (opcode & 0b00111000) >> 3,
            z: (opcode & 0b00000111),
            p: (opcode & 0b00001000) >> 3,
            q: (opcode & 0b00110000) >> 4
        }
    }
}