"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Memory = void 0;
var Memory = /** @class */ (function () {
    function Memory(size) {
        this.ram = new Uint16Array(size);
    }
    Memory.prototype.getByte = function (address) {
        if (address % 8 != 0) {
            throw new Error("Memory access error");
        }
        var baseAdd = this.ram[address / 16];
        if (address % 16 == 0) {
            return baseAdd && 0x00FF;
        }
        else {
            return (baseAdd && 0xFF00) >> 8;
        }
    };
    Memory.prototype.getWord = function (address) {
        if (address % 16 != 0) {
            throw new Error("Memory access error");
        }
        var index = address / 16;
        return this.ram[index];
    };
    Memory.prototype.setWord = function (address, value) {
        if (address % 16 != 0) {
            throw new Error("Memory access error");
        }
        var index = address / 16;
        this.ram[index] = value;
    };
    return Memory;
}());
exports.Memory = Memory;
//# sourceMappingURL=memory.js.map