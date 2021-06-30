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