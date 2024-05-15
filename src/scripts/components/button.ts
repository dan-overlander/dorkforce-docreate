import { doId } from "../do-id";
import { doElement } from "../do-element";
import { doClass } from "../do-class";
import { doListener } from "../do-listener";
import { doObserve } from "../do-observe";
import { getFromDom } from "../utils/get-from-dom";
import { getTarget } from "../utils/get-target";
import { addChevronClasses } from "../utils/add-chevron-classes";
import { getDataAttributes } from "../utils/get-data-attributes";

export const button = (options: any = {}) => {
    if (typeof options === `string`) {
        options = {
            label: options,
        }
    }
    const noo: any = {};
    const optId = options.id || doId(`button`);
    const optChevron = options.chevron || undefined;
    const optClass = options.class || ``;
    const optClick = options.onclick || options.onClick || options.click || undefined;
    const optLabel = options.label || ``;
    const optRole = options.role || `button`;
    const optType = options.type || `button`;
    const optTitle = options.title || ``;
    const optTabIndex = options.tabindex || 0;
    const optAriaLabel = options.ariaLabel || ``;
    const optAriaDescribedBy = options.ariaDescribedBy || ``;
    const optDisabled = options.disabled || false;
    const optIcon = options.icon;
    const iconIsString = optIcon && typeof optIcon === `string`;
    const iconObjectName = !iconIsString && optIcon ? optIcon.name : undefined;
    const iconObjectClass = !iconIsString && optIcon && optIcon.class ? optIcon.class : ``;
    const bIcon = {
        name: iconIsString ? optIcon : iconObjectName,
        class: iconObjectClass
    };
    const optDataAttributes = getDataAttributes(options);

    noo.button = doElement(`
        <button 
            id="${optId}"
            class="dds__button ${optClass}"
            type="${optType}"
            role="${optRole}"
            tabindex="${optTabIndex}"
            aria-label="${optAriaLabel}"
            ${optTitle ? `title="${optTitle}"` : ``}
            ${optDisabled ? `disabled="true"` : ``}
            ${optAriaDescribedBy ? `aria-described-by="${optAriaDescribedBy}"` : ``}
            ${optDataAttributes}
        >
            ${optLabel}
        </button>
    `);
    if (bIcon.name) {
        doClass.add(`.do__button__icon {
            pointer-events: none;
        }`);
        doClass.add(`.do__button__icon-label {
            margin-right: 0.5rem;
        }`);
        noo.icon = doElement(`<span class="dds__icon dds__icon--${bIcon.name} do__button__icon ${optLabel.length > 0 ? `do__button__icon-label` : ``} ${bIcon.class}" aria-hidden="true">`);
        if (optIcon.class && optIcon.class.indexOf(`--end`) > -1) {
            noo.button.appendChild(noo.icon);
        } else {
            noo.button.prepend(noo.icon);
        }
    }
    if (optClick) {
        doListener(`#${optId}`, `click`, optClick);
    }
    if (optChevron) {
        addChevronClasses();
        if (!optChevron.open || !optChevron.close || !optChevron.selector) {
            console.error(`DO: options.chevron should identify the properties: selector<selector>, open<event>, and close<event>`);
        }
        const handleActionClick = () => {
            document.getElementById(optId)?.querySelector(`.dds__icon`)?.classList.toggle(`do__chevron-rotated`);
        }
        const optSelector = optChevron.selector || `#${optId}`;
        const optOpen = optChevron.open || `ddsModalOpenedEvent`;
        const optClose = optChevron.close || `ddsModalClosedEvent`;
        noo.chevron = doElement(`<em class="dds__icon dds__icon--chevron-down do__chevron">`);
        noo.button.appendChild(noo.chevron);

        let selectedElement;
        const triggerInDomStatus = getFromDom(optSelector);
        const attachListeners = () => {
            selectedElement.addEventListener(optOpen, handleActionClick);
            selectedElement.addEventListener(optClose, handleActionClick);                
        };
        if (triggerInDomStatus?.found) {
            selectedElement = triggerInDomStatus.element;
            attachListeners();
        } else if (!triggerInDomStatus?.found && doObserve) {
            doObserve.addition(optSelector, (e) => {
                selectedElement = getTarget(optSelector);
                attachListeners();
            });
        } else {
            // NOTE: can fix this by adding observer behavior
            console.error(`DO: Button: Unable to attach listeners to handle chevron animation`)
        }
    }

    return noo.button;
}