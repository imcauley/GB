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
    cpu.runCycle();
    expect(cpu.registers[0].get()).toBe(0x05);
    cpu.runCycle();
    expect(cpu.registers[0].get()).toBe(0x06);
})

test('add B to A', () => {
    // LD B, 4
    // LD A, 4
    // ADD A, B
    let program = new Uint16Array([0x0604, 0x3E04, 0x8000]);
    let mem = new Memory(400, program);

    const value = mem.getWord(0);

    let cpu = new CPU(mem);
    cpu.runCycle();
    expect(cpu.registers[0].get()).toBe(0x04);
    cpu.runCycle();
    expect(cpu.registers[7].get()).toBe(0x04);
    cpu.runCycle();
    expect(cpu.registers[7].get()).toBe(0x08);
})

test('half carry flag', () => {
    // LD B, 0x0F
    // LD A, 4
    // ADD A, B
    let program = new Uint16Array([0x060F, 0x3E04, 0x8000]);
    let mem = new Memory(400, program);

    const value = mem.getWord(0);

    let cpu = new CPU(mem);
    cpu.runCycle();
    cpu.runCycle();
    cpu.runCycle();
    expect(cpu.registers[7].get()).toBe(0x04 + 0x0F);
    expect(cpu.statusRegister.getFlag('H')).toBe(true);
})

test('full carry flag', () => {
    // LD B, 0xFF
    // LD A, 4
    // ADD A, B
    let program = new Uint16Array([0x06FF, 0x3E04, 0x8000]);
    let mem = new Memory(400, program);

    const value = mem.getWord(0);

    let cpu = new CPU(mem);
    cpu.runCycle();
    cpu.runCycle();
    cpu.runCycle();
    expect(cpu.registers[7].get()).toBe(0x03);
    expect(cpu.statusRegister.getFlag('C')).toBe(true);
})