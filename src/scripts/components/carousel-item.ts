import { doId } from "../do-id";
import { doElement } from "../do-element";

export const carouselItem = (options: any = {}) => {
    const noo: any = {};
    const optLabel = options.label || `Carousel Item`;
    const optId = options.id || doId(optLabel.replace(/[^0-9a-zA-Z]+/, ``));
    const optClass = options.class || ``;
    const optAriaLabel = options.ariaLabel || optLabel;
    let optBody = options.body || ``;
    if (!Array.isArray(optBody.constructor)) {
        if (typeof optBody === `string`) {
            try {
                optBody = doElement(optBody);
            } catch (e) {
                console.error(`DO: carouselItem: unable to convert optBody to element`);
            }
        }
    }

    noo.item = doElement(`<div id="${optId}" class="dds__carousel__item ${optClass}" role="group" aria-label="${optAriaLabel}">`);
    noo.item.appendChild(optBody);

    return noo.item;
};