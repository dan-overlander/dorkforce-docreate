import { doId } from "../do-id";
import { doElement } from "../do-element";
import { getDataAttributes } from "../utils/get-data-attributes";

export const datePicker = (options: any = {}) => {
    const noo: any = {};
    const optId = options.id || doId(`datepicker`);
    const optClass = options.class || ``;
    const optRequired = options.required || false;
    const optLabel = options.label || ``;
    const optPlaceholder = options.placeholder || `Enter the date`;
    const optHelper = options.helper || ``;
    const optError = options.error || ``;
    const optDataAttributes = getDataAttributes(options);

    noo.comp = doElement(`<div id="${optId}" class="dds__date-picker ${optClass}" data-dds="date-picker">`);
    noo.label = doElement(`<label id="${optId}-label" for="${optId}-control" class="dds__label ${optRequired ? `dds__label--required` : ``}">${optLabel}</label>`);
    noo.wrapper = doElement(`<div class="dds__date-picker__wrapper">`);
    noo.wrapperInput = doElement(`<input
        id="${optId}-control"
        name="${optId}-control-name"
        type="text"
        class="dds__date-picker__input"
        placeholder="${optPlaceholder}"
        ${optRequired ? `required=""` : ``}
        aria-labelledby="${optId}-label ${optId}-helper"
        ${optDataAttributes}
    />`);
    noo.wrapperSmall = doElement(`<small id="${optId}-helper" class="dds__date-picker__helper">${optHelper}</small>`);
    noo.wrapperError = doElement(`<div id="${optId}-error" class="dds__date-picker__invalid-feedback">${optError}</div>`);

    noo.comp.appendChild(noo.label);
    noo.comp.appendChild(noo.wrapper);
    noo.wrapper.appendChild(noo.wrapperInput);
    noo.wrapper.appendChild(noo.wrapperSmall);
    noo.wrapper.appendChild(noo.wrapperError);

    return noo.comp;
};