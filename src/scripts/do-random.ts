import * as crypto from "crypto";

export const doRandom = (min: number = 100000000, max: number = 999999999): number => {
    const range = max - min + 1;
    const randomBytes = crypto.randomBytes(4);
    const randomNumber = randomBytes.readUInt32LE(0) % range + min;
    return randomNumber;
};
