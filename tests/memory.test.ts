import {Memory} from '../src/memory';

test('index 0 access', () => {
    let mem = new Memory(400);
    mem.setWord(0, 0x0050);

    const value = mem.getWord(0);
    expect(value).toBe(0x0050);
})

test('index 0 access bad', () => {
    let mem = new Memory(400);
    expect(() => mem.setWord(2, 0x0050)).toThrow(Error)
})

test('high index test', () => {
    let mem = new Memory(400);
    mem.setByte(24, 0x0050);
    mem.setWord(64, 0x0050);

    expect(mem.getByte(24)).toBe(0x0050);
    expect(mem.getWord(64)).toBe(0x0050);
})