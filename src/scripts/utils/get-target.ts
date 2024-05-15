import { getFromDom } from "./get-from-dom";
import { doId } from "../do-id";

export const getTarget = (target, silent: boolean = false) => {
    if (!target) {
        return;
    }
    const domStatus = getFromDom(target);
    if (domStatus && domStatus.found) {
        target = domStatus.element
    }
    try {
        if (typeof target !== `string` && !target.id) {
            target.id = doId();
        }
    } catch (e) {
        if (!silent) {
            console.error(`DO: getTarget failed because target is not yet added to the DOM`, e);
        }
    }
    return target;
};