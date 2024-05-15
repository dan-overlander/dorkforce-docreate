import { doId } from "../do-id";
import { doElement } from "../do-element";
import { getDataAttributes } from "../utils/get-data-attributes";

export const list = (options: any = {}) => {
    const noo: any = {};
    const optId = options.id || doId(`list`);
    const optClass = options.class || ``;
    const optItems = options.items || [];

    noo.comp = doElement(`<ul id="${optId}" class="dds__list ${optClass}">`);
    optItems.forEach(oItem => {
        const itemId = oItem.id || `${optId}-item`;
        const itemRole = oItem.role || `listitem`;
        const itemClass = oItem.class || ``;
        const itemText = oItem.text || ``;
        const itemDataAttributes = getDataAttributes(oItem);
        noo.comp.appendChild(doElement(`<li id="${itemId}" role="${itemRole}" class="${itemClass}" ${itemDataAttributes}>${itemText}`));
    })

    noo.comp.element = noo.comp;
    return noo.comp;
};