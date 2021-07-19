import {CPU} from '../src/cpu';
import {Memory} from '../src/memory';

test('test 0 bit', () => {
    // LDB, 0x04 = 0x0604
    let program = new Uint16Array([0x06FF, 0xCB40, 0x06FE, 0xCB40]);
    let mem = new Memory(400, program);
    let cpu = new CPU(mem);
    cpu.runCycle();
    cpu.runCycle();
    expect(cpu.statusRegister.getFlag('Z')).toBe(false);
    cpu.runCycle();
    cpu.runCycle();
    expect(cpu.statusRegister.getFlag('Z')).toBe(true);
})
