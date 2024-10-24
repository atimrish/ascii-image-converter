import {IPNGPixel} from "../interfaces/chunks.js";
import {toRGBA} from "../helper.js";

const paethPredictor = (a:number, b: number, c: number): number => {
    const p = a + b - c
    const predict = [Math.abs(p -a), Math.abs(p - b), Math.abs(p - c)]
    const min = Math.min(...predict)
    return [a, b, c][(predict.findIndex(i => i === min))]
}

const paeth = (prevPixels: Array<IPNGPixel>, currentLine: Buffer): Array<IPNGPixel> => {
    const pixels:Array<IPNGPixel> = []

    let sliceIndex = 0
    let pixelIndex = 0
    ///TODO можно будет реализовать класс для линии буфера с кастомным итератором в зависимости от длины пикселя
    while (sliceIndex < currentLine.length) {
        const currentPixel = toRGBA(currentLine.subarray(sliceIndex, sliceIndex += 4))
        const leftPixel = pixels[pixelIndex - 1] ?? {r: 0, g: 0, b: 0, a: 0}
        const leftAbovePixel = prevPixels[pixelIndex - 1] ?? {r: 0, g: 0, b: 0, a: 0}
        const abovePixel = prevPixels[pixelIndex]

        currentPixel.r = Math.abs(currentPixel.r + paethPredictor(leftPixel.r, abovePixel.r, leftAbovePixel.r)) % 256
        currentPixel.g = Math.abs(currentPixel.g + paethPredictor(leftPixel.g, abovePixel.g, leftAbovePixel.g)) % 256
        currentPixel.b = Math.abs(currentPixel.b + paethPredictor(leftPixel.b, abovePixel.b, leftAbovePixel.b)) % 256
        currentPixel.a = Math.abs(currentPixel.a + paethPredictor(leftPixel.a, abovePixel.a, leftAbovePixel.a)) % 256

        pixels.push(currentPixel)
        pixelIndex++
    }

    return pixels
}

export { paeth }
