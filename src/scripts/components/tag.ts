import { doId } from "../do-id";
import { doElement } from "../do-element";
import { doListener } from "../do-listener";

export const tag = (options: any = {}) => {
    const noo: any = {};
    const optId = options.id || doId(`tag`);
    const optClass = options.class || ``;
    const optClick = options.onclick || options.onClick || options.click || undefined;
    const optDismiss = options.dismiss || options.dismissible || false;
    const optLabel = options.label || `Tag`;
    const optAriaLabel = options.aria || options.ariaLabel || options.title || ``;

    noo.tag = doElement(`<div
        id="${optId}"
        class="dds__tag ${optClass}"
        data-dds="tag"
        data-dismiss="${optDismiss || false}"
        ${optDismiss ? `data-sr-dismiss="dismiss"` : ``}
    >`);
    noo.button = doElement(`<button type="button" aria-label="${optAriaLabel}">
        ${typeof optLabel === `string` ? optLabel : ``}
    </button>`);
    if (typeof optLabel !== `string`) {
        noo.button.appendChild(optLabel);
    }
    noo.tag.appendChild(noo.button);
    if (optClick) {
        doListener(`#${optId}`, `click`, optClick);
    }
    return noo.tag;
};