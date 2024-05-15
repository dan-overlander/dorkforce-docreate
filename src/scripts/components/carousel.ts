import { doId } from "../do-id";
import { doElement } from "../do-element";
import { addApi } from "../utils/add-api";
import { button } from "./button";
import { carouselItem } from "./carousel-item";

declare const DDS: any;

export const carousel = (options: any = {}) => {
    // finish later
    const noo: any = {};
    const optId = options.id || doId(`carousel`);
    const optClass = options.class || ``;
    const optAriaLabel = options.ariaLabel || ``;
    const optPrevious = options.previous || `Previous Page`;
    const optNext = options.next || `Next Page`;
    const optItems = options.items || [];

    noo.comp = doElement(`<div class="dds__carousel" id="${optId}" aria-label="${optAriaLabel}" role="region" aria-atomic="false" data-dds="carousel">`);
    noo.comp.controls = doElement(`<div class="dds__carousel__controls" role="group">`);
    noo.comp.controls.prev = button({
        class: `dds__button__icon dds__button--editorial-light dds__carousel__controls__prev`,
        icon: `chevron-left`,
        label: `<span class="dds__sr-only">${optPrevious}</span>`,
    });
    noo.comp.controls.next = button({
        class: `dds__button__icon dds__button--editorial-light dds__carousel__controls__next`,
        icon: `chevron-right`,
        label: `<span class="dds__sr-only">${optNext}</span>`,
    });
    noo.comp.wrapper = doElement(`<div class="dds__carousel__items-wrapper">`);
    noo.comp.wrapper.track = doElement(`<div class="dds__carousel__track" role="presentation">`);

    // for each item, append it to the track
    noo.comp.appendChild(noo.comp.controls);
    noo.comp.appendChild(noo.comp.wrapper);
    noo.comp.controls.appendChild(noo.comp.controls.prev);
    noo.comp.controls.appendChild(noo.comp.controls.next);
    noo.comp.wrapper.appendChild(noo.comp.wrapper.track);

    addApi({
        target: noo.comp, 
        isInternal: options.isInternal,
        api: {
            body: noo.comp.wrapper.track,
            querySelector: (sQuery) => {
                return noo.comp.wrapper.track(sQuery);
            },
            add: (items) => {
                if (items.constructor !== Array) {
                    items = [items];
                }
                items.forEach(item => {
                    const newItem = carouselItem(item);
                    noo.comp.wrapper.track.appendChild(newItem);
                });
                if (noo.comp.Carousel) {
                    noo.comp.Carousel.dispose();
                    return DDS.Carousel(noo.comp);
                }
            },
        },
    });

    noo.comp.api.add(optItems);

    return noo.comp;
};
