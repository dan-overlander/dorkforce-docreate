import { doId } from "../do-id";
import { doElement } from "../do-element";
import { getTarget } from "../utils/get-target";
import { button } from "./button";
import { addApi } from "../utils/add-api";

export const modal = (options: any = {}) => {
    if (!options.labels) {
        options.labels = {};
    }

    const noo: any = {};
    const optId = options.id || doId(`modal`);
    const optClass = options.class || ``;
    const optLabel = options.labels.trigger || options.label || `Show Modal`;
    const optTitle = options.labels.title || options.title || ``;
    const optTrigger = getTarget(options.trigger);
    const optParent = options.parent || document.querySelector(`body`);
    const optBody = typeof options.body === `string` ? doElement(`<span>${options.body}`) : options.body;
    const optFooter = options.footer;
    const optClick = options.onclick || options.onClick || options.click || undefined;

    if (optTrigger) {
        noo.trigger = optTrigger;
    } else {
        noo.trigger = button({
            label: optLabel,
            id: `${optId}-trigger`,
        });
        optParent.appendChild(noo.trigger);
    }

    noo.comp = doElement(`<div id="${optId}" role="dialog" data-dds="modal" class="dds__modal ${optClass}" data-trigger="#${noo.trigger.id}" aria-labelledby="${optId}-headline">`);
    noo.content = doElement(`<div class="dds__modal__content">`);
    noo.contentTitle = doElement(`<div class="dds__modal__header"><h3 class="dds__modal__title" id="${optId}-headline">${optTitle}</h3></div>`);
    noo.contentBody = doElement(`<div id="${optId}-body" class="dds__modal__body">`);
    noo.contentFooter = doElement(`<div class="dds__modal__footer">`);

    noo.comp.appendChild(noo.content);
    noo.content.appendChild(noo.contentTitle);
    noo.content.appendChild(noo.contentBody);
    noo.content.appendChild(noo.contentFooter);

    if (optBody) {
        noo.contentBody.appendChild(optBody);
    }
    if (optFooter) {
        noo.contentFooter.appendChild(optFooter);
    }
    if (optClick) {
        noo.comp.addEventListener(`ddsModalOpenedEvent`, optClick);
    }

    addApi({
        target: noo.comp,
        isInternal: options.isInternal,
        api: {
            appendChild: (e) => {
                if (!e) {
                    return;
                }
                if (typeof e === `string`) {
                    e = doElement(`<span>${e}`);
                }
                noo.contentBody.appendChild(e);
            },
            body: (e) => {
                if (e) {
                    if (typeof e === `string`) {
                        e = doElement(`<span>${e}`);
                    }
                    noo.contentBody.innerText = ``;
                    noo.contentBody.appendChild(e);
                } else {
                    return noo.contentBody.innerHTML;
                }
            }
        },
    });

    return noo.comp;
};