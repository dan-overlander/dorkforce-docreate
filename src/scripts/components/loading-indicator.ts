import { doId } from "../do-id";
import { doElement } from "../do-element";
import { doClass } from "../do-class";
import { addApi } from "../utils/add-api";

export const loadingIndicator = (options: any = {}) => {
    if (options.parent === document.querySelector(`body`)) {
        delete options.parent;
    }

    const noo: any = {};
    const optId = options.id || doId(`loadingIndicator`);
    const optClass = options.class || `dds__loading-indicator--lg dds__loading-indicator__overlay--blur`;
    const optParent = typeof options.parent === `string` ? document.querySelector(options.parent) : options.parent;
    const optSrOnly = options.srOnly || ``;
    const optLabel = options.label || ``;

    if (optParent) {
        doClass.add(`.ddsc__loading-indicator-centered {
            pointer-events: none;
            position: absolute;
        }`);
        doClass.add(`.ddsc__loading-indicator-button {
            pointer-events: none;
            position: absolute;
            height: initial !important;
        }`);
        doClass.add(`.ddsc__loading-indicator  .dds__loading-indicator {
            width: 100%;
        }`);
        if (optParent.nodeName === `BUTTON`)  {
            noo.comp = doElement(`<div id="${optId}" class="dds__loading-indicator dds__loading-indicator--md ddsc__loading-indicator-button dds__d-none">`);
            noo.compLabel = doElement(`<div class="dds__sr-only">${optLabel}</div>`);
            noo.compSpinner = doElement(`<div class="dds__loading-indicator__spinner"></div>`)

            noo.comp.appendChild(noo.compLabel);
            noo.comp.appendChild(noo.compSpinner);

            optParent.disable = () => {
                noo.comp.classList.remove(`dds__d-none`);
                optParent.disabled = true;
            };
            optParent.enable = () => {
                noo.comp.classList.add(`dds__d-none`);
                optParent.disabled = false;
            };
        } else {
            noo.comp = doElement(`<div id="${optId}" class="ddsc__loading-indicator">`);
            noo.compLoading = doElement(`<div class="dds__loading-indicator ${optClass} ddsc__loading-indicator-centered">`)
            noo.compLoadingOverlay = doElement(`<div class="dds__overlay dds__overlay--absolute">`);
            noo.compLoadingSr = doElement(`<div class="dds__sr-only">${optSrOnly}</div>`);
            noo.compLoadingSpinner = doElement(`<div class="dds__loading-indicator__spinner"></div>`);

            noo.comp.appendChild(noo.compLoading);
            noo.compLoading.appendChild(noo.compLoadingOverlay);
            noo.compLoading.appendChild(noo.compLoadingSr);
            noo.compLoading.appendChild(noo.compLoadingSpinner);

            addApi({
                target: noo.comp,
                isInternal: options.isInternal,
                api: {
                    show: (e) => {
                        optParent.querySelector(`.dds__loading-indicator`).classList.remove(`dds__d-none`);
                        optParent.disabled = true;
                    },
                    hide: (e) => {
                        optParent.querySelector(`.dds__loading-indicator`).classList.add(`dds__d-none`);
                        optParent.disabled = false;
                    }
                },
            });

        }

        optParent.prepend(noo.comp);
    } else {
        noo.comp = doElement(`<div id="${optId}" class="dds__loading-indicator__container ${optClass}" data-dds="loading-indicator">`);
        noo.compOverlay = doElement(`<div class="dds__loading-indicator__overlay" aria-hidden="true"></div>`);
        noo.compWrapper = doElement(`<div class="dds__loading-indicator__wrapper">`);
        noo.compWrapperLoader = doElement(`<div class="dds__loading-indicator">`);
        noo.compWrapperLoaderLabel = doElement(`<div class="dds__loading-indicator__label" aria-live="polite">${optLabel}</div>`);
        noo.compWrapperLoaderSpinner = doElement(`<div class="dds__loading-indicator__spinner"></div>`);

        noo.comp.appendChild(noo.compOverlay);
        noo.comp.appendChild(noo.compWrapper);
        noo.compWrapper.appendChild(noo.compWrapperLoader);
        noo.compWrapperLoader.appendChild(noo.compWrapperLoaderLabel);
        noo.compWrapperLoader.appendChild(noo.compWrapperLoaderSpinner);
    }
    return noo.comp;
};