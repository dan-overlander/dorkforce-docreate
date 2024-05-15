import { doId } from "../do-id";
import { doElement } from "../do-element";
import { getDataAttributes } from "../utils/get-data-attributes";

// Define interfaces for function options and value options
interface SelectOption {
    value: any;
    label: string;
}

interface SelectOptions {
    id?: string;
    class?: string;
    label?: string;
    helper?: string;
    error?: string;
    selected?: any;
    values: SelectOption[];
}

export const select = (options: SelectOptions = { values: [] }) => {
    // this is to be able to use doCreate.select internally within other doCreate methods and hide the label if needed
    const internalDdsComponentClasses = [`dds__pagination__per-page-select`];
    let isInternalUse = false;
    internalDdsComponentClasses.forEach(iClass => {
        if (options.class && options.class.indexOf(iClass) > -1) {
            isInternalUse = true;
        }
    });

    const noo: any = {};
    const optId = options.id || doId(`select`);
    const optClass = options.class || ``;
    const optLabel = options.label || ``;
    const optHelper = options.helper || ``;
    const optError = options.error || `Error`;
    const optSelected = options.selected;
    let optValues: SelectOption[] = [];

    options.values.forEach(oValue => {
        if (typeof oValue === 'string') {
            optValues.push({
                value: oValue,
                label: oValue,
            });
        } else {
            optValues.push(oValue);
        }
    });

    noo.comp = doElement(`<div id="${optId}" class="dds__select ${optClass}" data-dds="select">`);
    noo.wrap = doElement(`<div class="dds__select__wrapper">`);
    noo.wrapSelect = doElement(`<select id="${optId}_control" class="dds__select__field" aria-describedby="${optId}_helper">`);
    optValues.forEach(oValue => {
        const optDataAttributes = getDataAttributes(oValue);
        const selected = optSelected === oValue.value ? `selected="true"` : ``;
        const nooOption = doElement(`<option value="${oValue.value}" ${selected} ${optDataAttributes}>${oValue.label}</option>`);
        noo.wrapSelect.appendChild(nooOption);
    });

    if (!isInternalUse) {
        noo.label = doElement(`<label id="${optId}_label" for="${optId}_control" class="dds__label">${optLabel}</label>`);
        noo.comp.appendChild(noo.label);
    }
    noo.comp.appendChild(noo.wrap);
    noo.wrap.appendChild(noo.wrapSelect);

    if (!isInternalUse) {
        noo.wrapSmall = doElement(`<small id="${optId}_helper" class="dds__select__helper">${optHelper}</small>`);
        noo.wrap.appendChild(noo.wrapSmall);
        noo.wrapErr = doElement(`<div id="${optId}_error" class="dds__invalid-feedback">${optError}</div>`);
        noo.wrap.appendChild(noo.wrapErr);
    }

    return noo.comp;
};
