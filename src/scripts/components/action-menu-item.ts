import { doId } from "../do-id";
import { doClass } from "../do-class";
import { doElement } from "../do-element";
import { icon } from "./icon";
import { doListener } from "../do-listener";
import { getDataAttributes } from "../utils/get-data-attributes";

interface ActionMenuItemOptions {
    label?: string;
    value?: string;
    class?: string;
    onclick?: () => void;
    onClick?: () => void;
    click?: () => void;
    id?: string;
    icon?: string;
}

export const actionMenuItem = (options: ActionMenuItemOptions = {}): HTMLElement => {
    const optLabel = options.label || "Item Label";
    const optDataValue = options.value;
    const optClass = options.class || "";
    const optClick = options.onclick || options.onClick || options.click;
    const optId = options.id || doId(optLabel.replace(/[^0-9a-zA-Z]+/, ""));
    const optIcon = options.icon || "minus-minimize";
    const asOption = options.value != null;
    const optDataAttributes = getDataAttributes(options);
    doClass.add(`.pointer-none {
        pointer-events: none;
    }`);

    const item = doElement(`<li class="${asOption ? "dds__action-menu__option" : "dds__action-menu__item"}" role="none">`) as HTMLElement;
    const itemButton = doElement(`<button id="${optId}" 
        type="button"
        class="${optClass}" 
        role="${asOption ? "menuitemcheckbox" : "menuitem"}"
        tabindex="-1"
        aria-disabled="false"
        aria-checked="false"
        ${optDataValue ? `data-value="${optDataValue}"` : ""}
        ${optDataAttributes}
    >`) as HTMLButtonElement;

    const itemSvg = doElement(`<svg class="dds__action-menu__icon pointer-none" aria-hidden="${optIcon ? "false" : "true"}">`) as SVGSVGElement;
    const itemSvgUse = icon({
        icon: optIcon,
        class: "dds__button__icon--start",
    });
    const itemText = doElement(`<span class="pointer-none">${optLabel}</span>`) as HTMLElement;

    item.appendChild(itemButton);
    itemButton.appendChild(itemSvg);
    itemButton.appendChild(itemText);
    itemSvg.appendChild(itemSvgUse);
    if (optClick) {
        doListener(`#${optId}`, "click", optClick);
    }
    return item;
};
