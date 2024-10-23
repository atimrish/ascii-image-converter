const subFilter = (lineBuffer, pixelLength) => {
    const pixelsSubarray = []
    let index = 0

    while (index < lineBuffer.length) {
        pixelsSubarray.push(lineBuffer.subarray(index, index += pixelLength))
    }

    ///TODO: работать с текущим буфером, не создавать новый массив
    // const pixels = []
    // let prevPixel = pixelsSubarray[0]
    // for (let i = 1; i < pixelsSubarray.length; i++) {
    //
    // }

    pixelsSubarray.forEach((pix, index) => {
        const arr = Array.from(pix)
        console.log(index, arr.join(' '))
    })
}

export {subFilter}