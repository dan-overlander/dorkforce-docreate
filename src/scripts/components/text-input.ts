import { doId } from "../do-id";
import { doElement } from "../do-element";
import { doClass } from "../do-class";
import { doListener } from "../do-listener";
import { getDataAttributes } from "../utils/get-data-attributes";

export const textInput = (options: any = {}) => {
    const noo: any = {};
    const optId = options.id || doId(`textinput`);
    const optClass = options.class || ``;
    const optIcon = options.icon || ``;
    const optIconStart = options.iconStart == "true" || true;
    const optLabel = typeof options.label === `string` ? options.label : options.label?.main || ``;
    const optPasswordButton = typeof options.label === `string` ? `Show` : options.label?.password || `Show`;
    const optPasswordTitle = typeof options.label === `string` ? `Show password` : options.label?.title || `Show password`;
    const optPlaceholder = options.placeholder || ``;
    const optRequired = options.required || false;
    const optMaxLength = options[`max-length`] || options.max || options.maxLength || ``;
    const optHelper = options.helper || ``;
    const optError = options.error || ``;
    const optValue = options.value || ``;
    const optClick = options.onclick || options.onClick || options.click || undefined;
    const optChange = options.onchange || options.onChange || options.change || undefined;
    const asFormField = options.asField || options.asFormField || options.formField || false;
    const optType = options.type || `text`;
    let optDataDds = ``;
    let optShowButton = ``;
    switch (optType) {
        case `password`:
            optDataDds = `data-dds="input-password"`
            noo.passWordButton = doElement(`<button type="button" class="dds__input__action dds__input__action--switch" title="${optPasswordTitle}">${optPasswordButton}</button>`);
            break;
        case `tel`:
            optDataDds = `data-dds="input-mask"`
            break;
    }
    const optDataAttributes = getDataAttributes(options);

    noo.formField = doElement(`<div class="dds__form__field">`);
    noo.container = doElement(`<div id="${optId}" class="dds__input-text__container ${optClass}" ${optDataDds}>`);
    noo.label = doElement(`<label id="${optId}-label" for="${optId}-input" class="dds__label ${optRequired ? `dds__label--required` : ``}">${optLabel}</label>`);
    noo.wrapper = doElement(`<div class="dds__input-text__wrapper">`);
    noo.input = doElement(`<input
        id="${optId}-input"
        name="${optId}-input-name"
        type="${optType}"
        class="dds__input-text ${optIcon ? optIconStart ? `dds__has__icon--start` : ` dds__has__icon--end` : ``}"
        placeholder="${optPlaceholder}"
        aria-labelledby="${optId}-label ${optId}-helper"
        ${optRequired ? `required="true"` : ``}
        ${optMaxLength ? `max-length="${optMaxLength}` : ``}
        ${optDataAttributes}
    >`);
    if (optValue) {
        noo.input.value = optValue;
    }
    noo.icon = doElement(`<em
        class="dds__icon dds__icon--${optIcon || `search`} dds__input-text__icon--${optIconStart ? `start` : `end`}"
        aria-hidden="true"
    >`);
    noo.helper = doElement(`
        <small
            id="${optId}-helper"
            class="dds__input-text__helper ${!optHelper ? `dds__d-none` : ``}"
        >
            ${optHelper}
        </small>`);
    noo.error = doElement(`<div id="${optId}-error"
        class="dds__invalid-feedback ${!optError ? `dds__d-none` : ``}"
    >
        ${optError}
    </div>`);
    if (!optHelper) {
        doClass.add(`#${optId} { margin-top: -12px; margin-bottom: 9px;}`);
    }
    if (asFormField) {
        noo.formField.appendChild(noo.container);
    }
    noo.container.appendChild(noo.label);
    if (noo.passWordButton) {
        noo.container.appendChild(noo.passWordButton);
    }
    noo.container.appendChild(noo.wrapper);
    noo.wrapper.appendChild(noo.input);
    if (optIcon) noo.wrapper.appendChild(noo.icon);
    noo.wrapper.appendChild(noo.helper);
    noo.wrapper.appendChild(noo.error);
    if (optClick) {
        doListener(`#${optId}`, `click`, optClick);
    }
    if (optChange) {
        doListener(`#${optId}`, `change`, optChange);
    }
    return asFormField ? noo.formField : noo.container;
};