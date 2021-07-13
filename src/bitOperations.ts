export class BitOperations {
    public static swapBytes(word: number) {
        const high = (word & 0xFF00) >> 8; 
        const low = (word & 0x00FF) << 8;
        return low + high;
    }
}