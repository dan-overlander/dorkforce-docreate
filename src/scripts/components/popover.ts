import { doId } from "../do-id";
import { doElement } from "../do-element";
import { doClass } from "../do-class";
import { getTarget } from "../utils/get-target";
import { icon } from "./icon";
import { button } from "./button";

export const popover = (options: any = {}) => {
    const noo: any = {};
    const optId = options.id || doId(`popover`);
    const optLabel = options.label || icon({
        icon: `help-cir`,
        type: `font`,
    }).outerHTML;
    const optClass = options.class || ``;
    let optTrigger = getTarget(options.trigger)
    if (!optTrigger) {
        optTrigger = button({
            label: optLabel,
        });
        options.parent.appendChild(optTrigger);
    };
    const optCallback = options.callback || undefined;
    const optTitle = options.title || ``;
    const optBody = options.body || ``;
    const optArrow = options.arrow == `true` || true;
    const optClose = options.close == `true` || true;

    if (!optTrigger) {
        console.error(`DO:Popover :: failed due to no options.trigger`, optTrigger);
        return;
    }
    if (typeof optTrigger === `string`) {
        optTrigger = {
            id: optTrigger.replace(`#`, ``),
        }
    }
    if (!optArrow) {
        doClass.add(`#${optId} .dds__popover__pointer { display: none !important;}`);
    }
    if (!optClose) {
        doClass.add(`#${optId} .dds__popover__close { display: none !important;}`);
    }
    if (!options.title) {
        doClass.add(`#${optId} .dds__popover__header { display: none !important;}`);
    }
    noo.popover = doElement(`<div 
        id="${optId}"
        class="dds__popover ${optClass}"
        role="dialog"
        aria-labelledby="${optId}-title"
        data-dds="popover"
        data-trigger="#${optTrigger.id}"
    >`);
    noo.content = doElement(`<div class="dds__popover__content">`);
    noo.header = doElement(`<div class="dds__popover__header">`);
    noo.headline = doElement(`<h6 id="${optId}-title" class="dds__popover__headline">${optTitle}</h6>`);
    noo.body = doElement(`<div class="dds__popover__body">${optBody}</div>`);
    if (optCallback) {
        optCallback(noo.body);
    }
    noo.popover.appendChild(noo.content);
    noo.content.appendChild(noo.header);
    noo.content.appendChild(noo.body);
    noo.header.appendChild(noo.headline);
    return noo.popover;
};