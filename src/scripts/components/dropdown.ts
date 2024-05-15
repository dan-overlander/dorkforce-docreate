import { doId } from "../do-id";
import { doElement } from "../do-element";
import { doListener } from "../do-listener";
import { dropdownItem } from "./dropdown-item";

export const dropdown = (options: any = {}) => {
    const noo: any = {};
    const optId = options.id || doId(`dropdown`);
    const optClass = options.class || ``;
    const optSelection = options.selection ? `data-selection="${options.selection}"` : ``;
    const optLabel = options.label || ``;
    const optHelper = options.helper || ``;
    const optError = options.error || ``;
    const optSelectAllLabel = options.selectAllLabel || `Select All`;
    const optAutocomplete = options.autocomplete ? 'on' : `off`;
    const optItems = options.items || [];
    const optDisabled = options.disabled || false;
    const optRequired = options.required || false;
    const optPlaceholder = options.placeholder || ``;
    const optMaxLength = options.maxlength != null ? `maxlength="${options.maxlength}"` : ``;
    const optChange = options.onchange || options.onChange || options.change || undefined;
    
    noo.comp = doElement(`<div id="${optId}"
        class="dds__dropdown ${optClass}"
        data-dds="dropdown"
        ${optSelection}
        data-select-all-label="${optSelectAllLabel}"
        ${optRequired ? `data-required="true"`: ``}
    >`);
    noo.container = doElement(`<div class="dds__dropdown__input-container">`);
    noo.label = doElement(`<label id="${optId}-label" for="${optId}-input" ${optRequired ? `class="dds__label--required"` : ``}>${optLabel}</label>`);
    noo.wrapper = doElement(`<div 
        class="dds__dropdown__input-wrapper"
        role="combobox"
        aria-haspopup="listbox"
        aria-controls="${optId}-popup"
        aria-expanded="false"
    >`);
    noo.input = doElement(`<input 
        id="${optId}-input"
        name="${optId}-input-name"
        type="text"
        class="dds__dropdown__input-field"
        autocomplete: "${optAutocomplete}"
        aria-labelledby="${optId}-label ${optId}-helper",
        aria-expanded="false"
        aria-controls="${optId}-list"
        ${optPlaceholder ? `placeholder="${optPlaceholder}"`: ``}
        ${optDisabled ? `disabled="true"` : ``}
        ${optMaxLength}
    >`);
    noo.feedback = doElement(`<em class="dds__icon dds__icon--alert-notice dds__dropdown__feedback__icon" aria-hidden="true">`);
    noo.helper = doElement(`<small 
        id="${optId}-helper"
        class="dds__input-text__helper ${optHelper === `` ? `dds__d-none` : ``}"
    >${optHelper}</small>`);
    noo.error = doElement(`<div 
        id="${optId}-error"
        class="dds__invalid-feedback ${!optError ? `dds__d-none` : ``}"
    >${optError}</div>`);
    noo.popup = doElement(`<div 
        id="${optId}-popup"
        class="dds__dropdown__popup dds__dropdown__popup--hidden"
        role="presentation"
        tabindex="-1"
    >`);
    noo.list = doElement(`<ul id="${optId}-list" tabindex="-1" role="listbox" class="dds__dropdown__list">`);

    noo.comp.appendChild(noo.container);
    noo.container.appendChild(noo.label);
    noo.comp.appendChild(noo.wrapper);
    noo.wrapper.appendChild(noo.input);
    noo.wrapper.appendChild(noo.feedback);
    noo.wrapper.appendChild(noo.helper);
    noo.wrapper.appendChild(noo.error);
    noo.comp.appendChild(noo.popup);
    noo.popup.appendChild(noo.list);

    noo.comp.appendChild = (childEl) => {
        noo.comp.querySelector(`.dds__dropdown__list`).appendChild(childEl);
    };

    optItems.forEach(oItem => {
        const newDropItem = dropdownItem(oItem);
        noo.comp.appendChild(newDropItem);
    });
    if (optChange) {
        doListener(`#${optId}`, `ddsDropdownSelectionChangeEvent`, optChange);
    }
    return noo.comp;
};