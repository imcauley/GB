"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var memory_1 = require("../src/memory");
test('index 0 access', function () {
    var mem = new memory_1.Memory(400);
    mem.setWord(0, 0x0050);
    var value = mem.getWord(0);
    expect(value).toBe(0x0050);
});
test('index 0 access bad', function () {
    var mem = new memory_1.Memory(400);
    expect(function () { return mem.setWord(2, 0x0050); }).toThrow(Error);
});
//# sourceMappingURL=memory.test.js.map