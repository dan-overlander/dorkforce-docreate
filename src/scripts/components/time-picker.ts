import { doId } from "../do-id";
import { doElement } from "../do-element";
import { getDataAttributes } from "../utils/get-data-attributes";

export const timePicker = (options: any = {}) => {
    const noo: any = {};
    const optId = options.id || doId(`timepicker`);
    const optClass = options.class || ``;
    const optRequired = options.required || false;
    const optLabel = options.label || `Select time slot`;
    const optHelper = options.helper || ``;
    const optError = options.error || `Invalid time. Please, type a valid time or select one from the list`;
    const optValue = options.value || ``;
    const optDataAttributes = getDataAttributes(options);

    noo.comp = doElement(`<div class="dds__time-picker ${optClass}" id="${optId}" data-dds="time-picker">`);
    noo.comp.container = doElement(`<div class="dds__time-picker__input-container">`);
    noo.comp.container.label = doElement(`<label class="dds__label ${optRequired ? `dds__label--required` : ``}" id="${optId}-label">${optLabel}</label>`);
    noo.comp.container.wrapper = doElement(`<div class="dds__time-picker__input-wrapper">`);
    noo.comp.container.wrapper.input = doElement(`<input
        class="dds__time-picker__input"
        type="text"
        role="combobox"
        autocomplete="off"
        aria-expanded="false"
        aria-autocomplete="list"
        aria-labelledby="${optId}-label ${optId}-helper"
        ${optRequired ? `required="true"` : ``}
        ${optValue ? `value="${optValue}"` : ``}
        ${optDataAttributes}
    >`);
    noo.comp.container.helper = doElement(`<small class="dds__input-text__helper" id="${optId}-helper">${optHelper}</small>`);
    noo.comp.container.error = doElement(`<div class="dds__time-picker__invalid-feedback">${optError}</div>`);

    noo.comp.appendChild(noo.comp.container);
    noo.comp.container.appendChild(noo.comp.container.label);
    noo.comp.container.appendChild(noo.comp.container.wrapper);
    noo.comp.container.wrapper.appendChild(noo.comp.container.wrapper.input);
    noo.comp.container.appendChild(noo.comp.container.helper);
    noo.comp.container.appendChild(noo.comp.container.error);

    return noo.comp;
};