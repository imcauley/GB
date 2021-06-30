export class Memory {
    ram: Uint16Array

    constructor(size: number) {
        this.ram = new Uint16Array(size);
    }

    getByte(address: number): number {
        if(address % 8 != 0) {
            throw new Error("Memory access error");
        }

        const baseAdd = this.ram[address / 16];
        if(address % 16 == 0) {
            return baseAdd && 0x00FF;
        }
        else {
            return (baseAdd && 0xFF00) >> 8;
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