import {CPU} from '../src/cpu';
import {Memory} from '../src/memory';

test('increments', () => {
    // LD B, 4
    // INC B
    // INC B
    let program = new Uint16Array([0x0604, 0x0404, 0x0505]);
    let mem = new Memory(400, program);

    const value = mem.getWord(0);

    let cpu = new CPU(mem);
    cpu.runCycle();
    // cpu.runCycle();
    // expect(cpu.registers[0].get()).toBe(0x05);
    // cpu.runCycle();
    // expect(cpu.registers[0].get()).toBe(0x06);
    // cpu.runCycle();
    // cpu.runCycle();
    // expect(cpu.registers[0].get()).toBe(0x04);
})