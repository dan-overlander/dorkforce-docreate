import { doId } from "../do-id";
import { doElement } from "../do-element";
import { doListener } from "../do-listener";
import { getDataAttributes } from "../utils/get-data-attributes";

export const dropdownItem = (options: any = {}) => {
    if (typeof options === `string`) {
        options = {
            label: options,
        };
    }
    const noo: any = {};
    const optLabel = options.label || `Item Label`;
    const optClick = options.onclick || options.onClick || options.click || undefined;
    let optDataValue = options[`data-value`] != null ? options[`data-value`]
    : options[`value`] != null ? options[`value`]
    : undefined;
    const optId = options.id || doId(optLabel.replace(/[^0-9a-zA-Z]+/, ``));
    const optSelected = options.selected != null ? options.selected : options.checked != null ? options.checked : false;
    const optDataAttributes = getDataAttributes(options);

    if (optDataValue != null) {
        optDataValue = `data-value="${optDataValue}"`;
    } else {
        optDataValue = ``;
    }

    noo.item = doElement(`<li class="dds__dropdown__item" role="option">`);
    noo.itemButton = doElement(`<button
        id="${optId}"
        type="button"
        class="dds__dropdown__item-option"
        role="option"
        tabindex="-1"
        data-selected="${optSelected}"
        aria-checked="${optSelected}"
        ${optDataValue}
        ${optDataAttributes}
    >`);
    noo.itemText = doElement(`<span class="dds__dropdown__item-label">${optLabel}</span>`);

    noo.item.appendChild(noo.itemButton);
    noo.itemButton.appendChild(noo.itemText);
    if (optClick) {
        doListener(`#${optId}`, `click`, optClick);
    }
    return noo.item;
};