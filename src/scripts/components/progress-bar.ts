import { doId } from "../do-id";
import { doElement } from "../do-element";

export const progressBar = (options: any = {}) => {
    const noo: any = {};
    const optId = options.id || doId(`progressBar`);
    const optClass = options.class || ``;
    const optLabel = options.label || ``;
    const optHelper = options.helper || ``;

    noo.comp = doElement(`<div id="${optId}" class="dds__progress-bar ${optClass}" data-dds="progress-bar">`);
    noo.label = doElement(`<span id="${optId}-label" class="dds__progress-bar__label">${optLabel}</span>`);
    noo.indicator = doElement(`<div
        class="dds__progress-bar__indicator"
        role="progressbar"
        aria-labelledby="${optId}-label"
        aria-describedby="${optId}-helper"
    >`);
    noo.helper = doElement(`<span id="${optId}-helper" class="dds__progress-bar__helper-text">${optHelper}</span>`);

    noo.comp.appendChild(noo.label);
    noo.comp.appendChild(noo.indicator);
    noo.comp.appendChild(noo.helper);

    return noo.comp;
}