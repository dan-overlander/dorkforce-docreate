import { doId } from "../do-id";
import { doElement } from "../do-element";

export const messageBar = (options: any = {}) => {
    const noo: any = {};
    const optId = options.id || doId(`messageBar`);
    const optClass = options.class || ``;
    const optIcon = options.icon ? `dds__icon--${options.icon.replace('dds__icon--', '')}` : `dds__icon--alert-info-cir`;
    const optTitle = options.title || ``;
    const optBody = options.body || ``;
    const optGlobal = options.global || false;


    noo.comp = doElement(`<div
        id="${optId}"
        data-dds="message-bar"
        role="dialog"
        aria-describedby="${optId}-content"
        aria-labelledby="${optId}-title"
        class="dds__message-bar ${optClass}"
    >`);
    noo.compIcon = doElement(`<span class="dds__icon ${optIcon} dds__message-bar__icon" aria-hidden="true"></span>`);
    noo.compContent = doElement(`<div id="${optId}-content" class="dds__message-bar__content">${optBody}</div>`);
    noo.compContentTitle = doElement(`<b id="${optId}-title">${optTitle}</b>`)

    noo.comp.appendChild(noo.compIcon);
    noo.comp.appendChild(noo.compContent);
    noo.compContent.prepend(noo.compContentTitle);

    if (optGlobal) {
        noo.global = doElement(`<div class="dds__message-bar--global__container">`);
        noo.global.appendChild(noo.comp);
    }


    return noo.global || noo.comp;
};