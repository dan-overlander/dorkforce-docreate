import { doRandom } from "./do-random";

export const doId = (custom: string = "") => {
    let customId = custom;
    if (customId) {
        customId = customId.replace(/[^\w\s]/gi, '');
        customId = customId.replace(/ /g, ``);
    }
    return `${custom ? customId : null || ["a", "b", "c", "d", "e"][doRandom(0, 5)]}-${doRandom()}`;
};