import {Memory} from './memory';
import {Register} from './register';
import {DoubleRegister} from './doubleRegister';
import { match, __} from 'ts-pattern';
import { StatusRegister } from './statusRegister';
import { IndirectRegister } from './indirectRegister';
import { BitOperations } from './bitOperations';

export class CPU {
    memory: Memory;
    registers: Register[];
    doubleRegisters: Register[];
    statusRegister = new StatusRegister();
    stackPointer = new DoubleRegister();

    programCounter: number;

    PREFIX_BYTES = new Set([0xCB, 0xDD, 0xED, 0xFD]);
    CONDITION_TABLE = ["NZ", "Z", "NC", "C"];

    constructor(memory: Memory) {
        this.memory = memory;
        this.programCounter = 0;

        this.registers = [];
        this.doubleRegisters = [];

        this.stackPointer.set(0xFFFE);

        this.registers.push(new Register()); // B
        this.registers.push(new Register()); // C
        this.registers.push(new Register()); // D
        this.registers.push(new Register()); // E
        this.registers.push(new Register()); // H
        this.registers.push(new Register()); // L
        this.registers.push(new IndirectRegister(this.memory, this.registers[4], this.registers[5])) // (HL)
        this.registers.push(new Register()); // A
        this.registers.push(new Register()); // F


        this.doubleRegisters.push(new DoubleRegister(this.registers[0], this.registers[1])); // BC
        this.doubleRegisters.push(new DoubleRegister(this.registers[2], this.registers[3])); // DE
        this.doubleRegisters.push(new DoubleRegister(this.registers[4], this.registers[5])); // HL
        this.doubleRegisters.push(new DoubleRegister(this.registers[7], this.registers[8])); // AF
    }

    runCycle() {
        let opcodeAddress = 0x00;
        let prefix = 0x00;

        const currentByte = this.memory.getByte(this.programCounter);
        

        if(this.PREFIX_BYTES.has(currentByte)) {
            prefix = currentByte;
            opcodeAddress = this.programCounter + 0x08;
        }
        else {
            opcodeAddress = this.programCounter;
        }

        let opcode = this.memory.getByte(opcodeAddress);
        let byte2 = this.memory.getByte(opcodeAddress + 0x08);
        // let byte3 = this.memory.getByte(opcodeAddress + 0x10);

        const bytesUsed = this.interpretCode(opcode, byte2, prefix);

        if(bytesUsed) {
            this.programCounter += (0x08 * bytesUsed);
        }   
    }

    interpretCode(opcode: number, byte2?: number, prefix?: number) {
        const opcodeFragment = this.opcodeElements(opcode, prefix);

        return match(opcodeFragment)
        .with({x: 0, y: 0, z: 0}, () => {
            // NOP
            return 1;
        })
        .with({prefix: 0xCB, x:1}, () => {
            // BIT u3, r8
            const selectedBit = this.registers[opcodeFragment.z].get() & (0x01 << opcodeFragment.y);
            const isZero = selectedBit === 0x00;
            this.statusRegister.setFlags(isZero, false, true, false);
            return 2;
        })
        .with({x: 0, z: 6}, () => {
            // LD r, n8
            const se = this.registers[opcodeFragment.y].set(byte2);
            return 2;
        })
        .with({x: 0, z: 4}, () => {
            // INC r8
            let current = this.registers[opcodeFragment.y].get();
            this.registers[opcodeFragment.y].set(current + 1);
            return 1;
        })
        .with({x: 0, z: 5}, () => {
            // DEC r8
            let current = this.registers[opcodeFragment.y].get();
            this.registers[opcodeFragment.y].set(current - 1);
            return 1;
        })
        .with({x: 2, y: 0}, () => {
            // ADD A, r8
            const r = this.registers[opcodeFragment.z].get();
            const se = this.registers[7].operation((x: number) => {return x + r});
            this.statusRegister.setFlags(se.zeroResult, false, se.halfCarry, se.fullCarry);
            return 1;
        })
        .with({x: 2, y: 1}, () => {
            // ADC A, r8
            const r = this.registers[opcodeFragment.z].get();
            const carry = this.statusRegister.getFlag('C') ? 1 : 0;
            const se = this.registers[7].operation((x: number) => {return x + r + carry});
            this.statusRegister.setFlags(se.zeroResult, false, se.halfCarry, se.fullCarry);
            return 1;
        })
        .with({x: 2, y: 2}, () => {
            // SUB A, r8
            const r = this.registers[opcodeFragment.z].get();
            this.registers[7].operation((x: number) => {return x - r});
            return 1;
        })
        .with({x: 2, y: 1}, () => {
            // SBC A, r8
            const r = this.registers[opcodeFragment.z].get();
            const carry = this.statusRegister.getFlag('C') ? 1 : 0;
            const se = this.registers[7].operation((x: number) => {return x - r - carry});
            this.statusRegister.setFlags(se.zeroResult, false, se.halfCarry, se.fullCarry);
            return 1;
        })
        .with({x: 2, y: 4}, () => {
            // AND A, r8
            const r = this.registers[opcodeFragment.z].get();
            this.registers[7].operation((x: number) => {return x & r});
            return 1;
        })
        .with({x: 2, y: 5}, () => {
            // XOR A, r8
            const r = this.registers[opcodeFragment.z].get();
            this.registers[7].operation((x: number) => {return x ^ r});
            return 1;
        })
        .with({x: 2, y: 6}, () => {
            // OR A, r8
            const r = this.registers[opcodeFragment.z].get();
            this.registers[7].operation((x: number) => {return x | r});
            return 1;
        })
        .with({x: 3, y: 5, z: 0}, () => {
            // ADD SP, e8
            const e8 = BitOperations.convertToSigned(byte2)
            this.stackPointer.operation((x: number) => {return x + e8});
            return 2;
        })
        .with({x: 3, z: 2}, () => {
            // JP cc, n16
            const condition = this.CONDITION_TABLE[opcodeFragment.y];
            if(this.statusRegister.getFlag(condition)) {
                this.programCounter = byte2;
                return 0;
            }
            else {
                return 2;
            }
        })
        .with({x: 3, z: 3, y: 0}, () => {
            // JP n16
            this.programCounter = byte2;
            return 0;
        })
        .run()
    }

    opcodeElements(opcode: number, prefix: number) {
        return {
            x: (opcode & 0b11000000) >> 6,
            y: (opcode & 0b00111000) >> 3,
            z: (opcode & 0b00000111),
            p: (opcode & 0b00001000) >> 3,
            q: (opcode & 0b00110000) >> 4,
            prefix: prefix
        }
    }
}