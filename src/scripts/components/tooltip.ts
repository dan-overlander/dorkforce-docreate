import { doId } from "../do-id";
import { doElement } from "../do-element";
import { getTarget } from "../utils/get-target";
import { iconName } from "../utils/icon-name";
import { button } from "./button";

export const tooltip = (options: any = {}) => {
    const noo: any = {};
    const optId = options.id || doId(`tooltip`);
    const optLabel = options.label || ``;
    const optParent = options.parent || document.querySelector(`body`);
    let optTrigger = getTarget(options.trigger);
    if (!optTrigger) {
        optTrigger = button({
            id: `${optId}-trigger`,
            label: optLabel,
            class: `dds__button--primary`,
        });
        optParent.appendChild(optTrigger);
    }
    const optClass = options.class || ``;
    const optIcon = options.icon != null ? iconName(options.icon) : `dds__icon--alert-info-cir`;
    const optTitle = options.title || ``;
    const optTip = options.tip || `No options.tip was found.`;

    noo.container = doElement(`<span class="${optClass}">`);
    noo.anchor = optTrigger;
    noo.anchorSr = doElement(`<span
        id="anchorSr-${optId}"
        class="dds__sr-only"
        text="tooltip"
    >`);
    noo.anchorIcon = doElement(`<span id="anchorIcon-${optId}" class="dds__icon ${optIcon}">`);
    noo.tooltip = doElement(`<div
        id="${optId}"
        class="dds__tooltip"
        role="tooltip"
        data-dds="tooltip"
        data-trigger="#${noo.anchor.id}"
    >`);
    noo.body = doElement(`<div class="dds__tooltip__body">${optTip}</div>`);
    noo.bodyTitle = doElement(`<h6 class="dds__tooltip__title">${optTitle}</h6>`);

    if (noo.anchor && noo.anchor.appendChild) {
        noo.anchor.appendChild(noo.anchorSr);
    }
    if (optIcon) {
        noo.anchor.appendChild(noo.anchorIcon);
    }

    noo.container.appendChild(noo.tooltip);
    noo.tooltip.appendChild(noo.body);
    noo.body.prepend(noo.bodyTitle);

    return noo.tooltip;
};