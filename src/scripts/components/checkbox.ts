import { doId } from "../do-id";
import { doElement } from "../do-element";
import { doListener } from "../do-listener";
import { getDataAttributes } from "../utils/get-data-attributes";

export const checkbox = (options: any = {}) => {
    const noo: any = {};
    const optId = options.id || doId(`checkbox`);
    const optLabel = options.label || ``;
    const optClass = options.class || ``;
    const optClick = options.onclick || options.onClick || options.click || undefined;
    const optValue = options.value || ``;
    const optChecked = options.checked || false;
    const optRequired = options.required || false;
    const optError = options.error || `Invalid Entry`;
    const getCheckboxEl = () => {
        const thisCheckbox = document.getElementById(noo.input.id);
        if (!thisCheckbox) {
            console.error(`DO: Element #${noo.input.id} was not found`);
            return;
        }
        return thisCheckbox;
    }
    const optDataAttributes = getDataAttributes(options);

    // doCreate new components
    noo.comp = doElement(`<div id="${optId}" class="dds__checkbox ${optClass}">`);
    noo.label = doElement(`<label id="${optId}-label" class="dds__checkbox__label" for="${optId}-input">`);
    noo.input = doElement(`<input type="checkbox" tabindex="0" id="${optId}-input" name="${optId}-name" class="dds__checkbox__input" ${optDataAttributes}>`);
    if (optValue) noo.input.value = optValue;
    if (optChecked) noo.input.setAttribute(`checked`, optChecked);
    if (optRequired) noo.input.setAttribute(`required`, true);
    noo.content = doElement(`<span id="${optId}-content">${optLabel}</span>`);
    noo.error = doElement(`<div id="${optId}-error" class="dds__invalid-feedback">${optError}</div>`);

    // append new elements together
    noo.comp.appendChild(noo.label);
    noo.comp.appendChild(noo.error);
    noo.label.appendChild(noo.input);
    noo.label.appendChild(noo.content);

    // add methods
    noo.comp.indeterminate = (state) => {
        // must return to verify this method
        if (state == null) {
            console.error(`DO: indeterminate: must pass state`);
            return;
        }
        const thisCheckbox: any = getCheckboxEl();
        thisCheckbox.indeterminate = state;
        thisCheckbox.setAttribute(`aria-checked`, state ? `mixed` : `false`);
    };
    noo.comp.check = (state = true) => {
        const thisCheckbox: any = getCheckboxEl();
        thisCheckbox.checked = state;
        thisCheckbox.setAttribute(`aria-checked`, state);
    };
    if (optClick) {
        doListener(`#${noo.input.id}`, `change`, optClick);
    }

    // return base component
    return noo.comp;
};
