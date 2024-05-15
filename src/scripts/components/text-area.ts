import { doId } from "../do-id";
import { doElement } from "../do-element";
import { getDataAttributes } from "../utils/get-data-attributes";

export const textArea = (options: any = {}) => {
    const noo: any = {};
    const optId = options.id || doId(`textinput`);
    const optClass = options.class || ``;
    const optRequired = options.required || false;
    const optLabel = options.label || ``;
    const optHelper = options.helper || ``;
    const optError = options.error || ``;
    const optValue = options.value || ``;
    const optMaxLength = options[`max-length`] || options.max || options.maxLength || ``;
    const optRows = options.rows || ``;
    const optCols = options.cols || ``;
    const optDataAttributes = getDataAttributes(options);

    noo.comp = doElement(`<div id="${optId}" class="dds__text-area__container ${optClass}" data-dds="text-area">`);
    noo.header = doElement(`<div class="dds__text-area__header">`);
    noo.headerLabel = doElement(`<label id="${optId}-laebl" for="${optId}-control" class="dds__label ${optRequired ? `dds__label--required` : ``}">${optLabel}</label>`);
    noo.wrapper = doElement(`<div class="dds__text-area__wrapper">`);
    noo.wrapperControl = doElement(`<textarea
        class="dds__text-area"
        id="${optId}-control"
        name="${optId}-control-name"
        aria-labelledby="${optId}-label ${optId}-helper"
        ${optRequired ? `required="true"` : ``}
        ${optMaxLength ? `max-length="${optMaxLength}` : ``}
        ${optRows ? `rows="${optRows}"` : ``}
        ${optCols ? `cols="${optCols}"` : ``}
        ${optDataAttributes}
    >${optValue}</textarea>`);
    noo.wrapperHelper = doElement(`<small id="${optId}-helper" class="dds__input-text__helper">${optHelper}</small>`);
    noo.wrapperError = doElement(`<small id="${optId}-error" class="dds__invalid-feedback">${optError}</small>`);

    noo.comp.appendChild(noo.header);
    noo.comp.appendChild(noo.wrapper);
    noo.header.appendChild(noo.headerLabel);
    noo.wrapper.appendChild(noo.wrapperControl);
    noo.wrapper.appendChild(noo.wrapperHelper);
    noo.wrapper.appendChild(noo.wrapperError);

    return noo.comp;
};