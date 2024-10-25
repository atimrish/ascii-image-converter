interface IterableBuffer {
    buffer: Buffer
    chunkSize: number
    [Symbol.iterator](): IterableIterator<Buffer>
}

class IterableBuffer implements IterableBuffer {
    buffer: Buffer
    chunkSize: number

    constructor(buffer: Buffer, chunkSize: number) {
        this.buffer = buffer
        this.chunkSize = chunkSize
    }

    *[Symbol.iterator](): IterableIterator<Buffer> {
        let index = 0
        while (index < this.buffer.length) {
            yield this.buffer.subarray(index, index += this.chunkSize)
        }
    }
}

export {IterableBuffer}