import { doId } from "../do-id";
import { doElement } from "../do-element";
import { icon } from "./icon";
import { iconName } from "../utils/icon-name";

export const link = (options: any = {}) => {
    const noo: any = {};
    const optId = options.id || doId(`link`);
    const optLabel = options.label || ``;
    const optHref = options.href || `javascript:void(0);`;
    const optClass = options.class || ``;
    const optIcon = options.icon;

    noo.comp = doElement(`<a id="${optId}" class="${optClass}" href="${optHref}">${optLabel}</a>`);

    if (optIcon) {
        noo.icon = icon({
            icon: iconName(optIcon),
        });
        noo.comp.appendChild(noo.icon);
    }

    noo.comp.element = noo.comp;
    return noo.comp;
};