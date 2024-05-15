import { doId } from "../do-id";
import { doElement } from "../do-element";
import { getDataAttributes } from "../utils/get-data-attributes";

export const radioButton = (options: any = {}) => {
    const noo: any = {};
    const optId = options.id || doId(`radiobutton`);
    const optClass = options.class || ``;
    const optLegend = options.legend || ``;

    noo.radioset = doElement(`<fieldset
        class="dds__fieldset dds__radio-button-group ${optClass}"
        role="radiogroup"
    >`);
    if (options.required) {
        noo.radioset.setAttribute(`required`, true);
        noo.radioset.setAttribute(`aria-required`, true);
    }
    noo.legend = doElement(`<legend
        text="${optLegend}"
    >`);
    if (optLegend) noo.radioset.appendChild(noo.legend);
    options.buttons.forEach((radio, rIndex) => {
        const radioClass = radio.class || ``;
        const radioValue = radio.value || ``;
        const radioLabel = radio.label || ``;
        const optDataAttributes = getDataAttributes(radio);

        noo.button = doElement(`<div class="dds__radio-button ${radioClass}">`);
        noo.input = doElement(`<input 
            id="${optId}-button${rIndex}"
            name="${optId}-button-name"
            class="dds__radio-button__input"
            type="radio"
            value="${radioValue}"
            ${optDataAttributes}
        >`);
        noo.label = doElement(`<label
            class="dds__radio-button__label"
            id="${optId}-button-label${rIndex}"
            for="${optId}-button${rIndex}"
        >
            ${radioLabel}
        </label>`);
        noo.button.appendChild(noo.input);
        noo.button.appendChild(noo.label);
        noo.radioset.appendChild(noo.button);
    });
    noo.error = doElement(`<div
        id="${optId}-error"
        class="dds__invalid-feedback"
    >
        ${options.error || ``}
    </div>`);
    noo.radioset.appendChild(noo.error);
    return noo.radioset;
};