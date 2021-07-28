import {CPU} from './cpu';
import {Memory} from './memory';
import {Clock} from './clock';

class Motherboard {
    cpu: CPU;
    mem: Memory;
    clock: Clock;

    constructor(cartridge: Uint16Array) {
        this.mem = new Memory(4000, cartridge);
        this.cpu = new CPU(this.mem);
        this.clock = new Clock();

        const numCycles = 10;
        let currentCycle = 0;

        this.clock.onHigh(this.cpu.runCycle);
        this.clock.onHigh(function() {this.currentCycle++});

        this.clock.start(function() {return this.numCycles === this.currentCycle});
    }
}