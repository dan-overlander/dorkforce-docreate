import { doId } from "../do-id";
import { doElement } from "../do-element";
import { doListener } from "../do-listener";

export const switchClass = (options: any = {}) => {
    const noo: any = {};
    const optId = options.id || doId(`switch`);
    const optClass = options.class || ``;
    const optTabIndex = options.tabindex || `0`;
    const optChecked = options.checked != null ? options.checked : false;
    const optLabel = options.label || ``;
    const optOn = options.on || `On`;
    const optOff = options.off || `Off`;
    const optClick = options.onclick || options.onClick || options.click || undefined;

    noo.comp = doElement(`<div role="switch" data-dds="switch" tabindex="${optTabIndex}" class="dds__switch ${optClass}" id="${optId}" aria-checked="${optChecked}">`);
    noo.comp.label = doElement(`<span class="dds__switch__label">${optLabel}</span>`);
    noo.comp.area = doElement(`<div class="dds__switch__area" aria-hidden="true">`);
    noo.comp.area.track = doElement(`<span class="dds__switch__track"></span>`);
    noo.comp.area.track.handle = doElement(`<span class="dds__switch__handle"></span>`);
    noo.comp.area.controls = doElement(`<span class="dds__switch__control-label">`);
    noo.comp.area.controls.on = doElement(`<span class="dds__switch__control-label__on">${optOn}</span>`);
    noo.comp.area.controls.off = doElement(`<span class="dds__switch__control-label__off">${optOff}</span>`);

    noo.comp.appendChild(noo.comp.label);
    noo.comp.appendChild(noo.comp.area);
    noo.comp.area.appendChild(noo.comp.area.track);
    noo.comp.area.track.appendChild(noo.comp.area.track.handle);
    noo.comp.area.appendChild(noo.comp.area.controls);
    noo.comp.area.controls.appendChild(noo.comp.area.controls.on);
    noo.comp.area.controls.appendChild(noo.comp.area.controls.off);

    if (optClick) {
        doListener(`#${optId}`, `click`, optClick);
    }

    return noo.comp;
};