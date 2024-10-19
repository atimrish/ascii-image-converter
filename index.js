import * as fs from 'fs';
import {chunkParser} from "./lib/chunkParser.js";

const args = process.argv
const fileFlagIndex = args.findIndex(arg => arg === '--file')
const filePath = args[fileFlagIndex + 1];

const chunks = await new Promise((res, rej) => {
    fs.readFile(filePath, (err, data)=> err ? rej(err) : res(chunkParser(data)))
})
