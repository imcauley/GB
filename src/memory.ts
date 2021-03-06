import {BitOperations} from './bitOperations';

export class Memory {
    ram: Uint16Array

    constructor(size: number, program?: Uint16Array, littleEndianProgram?: boolean) {
        this.ram = new Uint16Array(size);
        if(program) {
            program.forEach((word, index) => {
                if(littleEndianProgram) {
                    this.ram[index] = word;
                }
                else { 
                    this.ram[index] = BitOperations.swapBytes(word);
                }
            })
        }
    }

    getByte(address: number): number {
        if(address % 8 != 0) {
            throw new Error("Memory access error");
        }

        const baseAdd = this.ram[Math.floor(address / 16)];
        if(address % 16 === 0) {
            return baseAdd & 0x00FF;
        }
        else {
            return (baseAdd & 0xFF00) >> 8;
        }
    }

    setByte(address: number, value: number) {
        if(address % 8 != 0) {
            throw new Error("Memory access error");
        }

        const index = Math.floor(address / 16);

        if(address % 16 === 0) {
            let current = this.ram[index];
            current = current & 0xFF00;
            current += value;
            this.ram[index] = current;
        }
        else {
            let current = this.ram[index];
            current = current & 0x00FF;
            value = value << 8;
            current += value;
            this.ram[index] = current;
        }

    }

    getWord(address: number): number {
        if(address % 16 != 0) {
            throw new Error("Memory access error");
        }

        const index = address / 16;

        return this.ram[index]
    }

    setWord(address: number, value: number) {
        if(address % 16 != 0) {
            throw new Error("Memory access error");
        }

        const index = address / 16;

        this.ram[index] = value;
    }
}