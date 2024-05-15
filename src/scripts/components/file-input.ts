import { doId } from "../do-id";
import { doElement } from "../do-element";
import { getDataAttributes } from "../utils/get-data-attributes";
import { button } from "./button";
import { icon } from "./icon";

export const fileInput = (options: any = {}) => {
    if (!options.labels) {
        options.labels = {};
    }
    const noo: any = {};
    const optId = options.id || doId(`fileInput`);
    const optClass = options.class || ``;        
    const optHelper = options.helper || ``;
    const optAccept = options.accept || `.png, .pdf, video/*`;
    const optMultiple = options.multiple || false;
    const optRequired = options.required || false;
    const optTitle = options.labels.title || `Upload`;
    const optBrowse = options.labels.browse || `Browse files`;
    const optError = options.labels.error || `Error`;
    const optDataAttributes = getDataAttributes(options);

    noo.comp = doElement(`<div id="${optId}" class="dds__file-input ${optClass}" data-dds="file-input" role="group" aria-labelledby="${optId}-label">`);
    noo.label = doElement(`<label id="${optId}-label" for="${optId}-control" class="dds__label ${optRequired ? `dds__label--required` : ``}">${optTitle}</label>`);
    noo.helper = doElement(`<small id="${optId}-helper" class="dds__file-input__helper-text">${optHelper}</small>`);
    noo.control = doElement(`  <input
        aria-hidden="true"
        id="${optId}-control"
        name="${optId}-control-name"
        type="file"
        class="dds__file-input__control"
        accept="${optAccept}"
        ${optMultiple ? `multiple=""`: ``}
        ${optRequired ? `required=""`: ``}
        ${optDataAttributes}
    />`);
    noo.button = button({
        class: `dds__button--secondary dds__button--md dds__file-input__button`,
        ariaDescribedBy: `${optId}-helper`,
    });
    // noo.buttonSvg = doElement(`<svg class="dds__icon dds__button__icon--start" focusable="false"><use xlink:href="#dds__icon--upload"></use></svg>`);
    noo.buttonSvg = icon({
        icon: `upload`,
        class: `dds__button__icon--start`,
    });
    noo.buttonContent = doElement(`<span id="${optId}-button-content">${optBrowse}</span>`);
    noo.error = doElement(`<div id="${optId}-error" aria-live="polite" class="dds__error-text">${optError}</div>`);
    noo.errorIcon = doElement(`<span class="dds__icon dds__icon--alert-notice dds__error-text__icon" aria-hidden="true"></span>`);

    noo.button.appendChild(noo.buttonSvg);
    noo.button.appendChild(noo.buttonContent);
    noo.error.prepend(noo.errorIcon);
    noo.comp.appendChild(noo.label);
    noo.comp.appendChild(noo.helper);
    noo.comp.appendChild(noo.control);
    noo.comp.appendChild(noo.button);
    noo.comp.appendChild(noo.error);

    return noo.comp;
};