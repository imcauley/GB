import {CPU} from '../src/cpu';
import {Memory} from '../src/memory';

test('index 0 access', () => {
    // LDB, 0x04 = 0x0604
    let program = new Uint16Array([0x0604]);
    let mem = new Memory(400, program);

    const value = mem.getWord(0);

    let cpu = new CPU(mem);
    cpu.runCycle();
    expect(cpu.registers[0].get()).toBe(0x04);
})

test('stack pointer', () => {
    let mem = new Memory(400);
    let cpu = new CPU(mem);

    expect(cpu.stackPointer.get()).toBe(0xFFFE);
})