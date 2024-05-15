import { doId } from "../do-id";
import { doElement } from "../do-element";
import { getDataAttributes } from "../utils/get-data-attributes";
import { addApi } from "../utils/add-api";

export const search = (options: any = {}) => {
    const noo: any = {};
    const optId = options.id || doId(`search`);
    const optClass = options.class || ``;
    const optLabel = options.label || ``;
    const optAutoComplete = options.autoComplete || `off`;
    const optPlaceholder = options.placeholder || ``;
    const optDataAttributes = getDataAttributes(options);

    noo.comp = doElement(`<div id="${optId}" class="dds__search ${optClass}" data-dds="search" role="search">`);
    noo.label = doElement(`<label class="dds__label" id="${optId}-label" for="${optId}-control">${optLabel}</label>`);
    noo.wrapper = doElement(`<div class="dds__search__wrapper">`);
    noo.wrapperControl = doElement(`<input
        type="search"
        class="dds__search__control"
        name="${optId}-control-name"
        id="${optId}-control"
        aria-labelledby="${optId}-label"
        autocomplete="${optAutoComplete}"
        placeholder="${optPlaceholder}"
        ${optDataAttributes}
    />`);

    noo.comp.appendChild(noo.label);
    noo.comp.appendChild(noo.wrapper);
    noo.wrapper.appendChild(noo.wrapperControl);

    addApi({
        target: noo.comp,
        isInternal: options.isInternal,
        api: {
            addEventListener: (sEvent, sCallback) => {
                noo.comp.addEventListener(sEvent, sCallback);
            },
            querySelector: (sQuery) => {
                return noo.comp.querySelector(sQuery);
            },
            focus: () => {
                noo.wrapperControl.focus();
            },
        }
    });

    return noo.comp;
};