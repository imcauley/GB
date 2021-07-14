import {CPU} from '../src/cpu';
import {Memory} from '../src/memory';

test('index 0 access', () => {
    // LDB, 0x04 = 0x0604
    let program = new Uint16Array([0xC324]);
    let mem = new Memory(400, program);
    let cpu = new CPU(mem);
    cpu.runCycle();
    expect(cpu.programCounter).toBe(0x24);
})