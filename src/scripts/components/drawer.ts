import { doId } from "../do-id";
import { doElement } from "../do-element";
import { getTarget } from "../utils/get-target";
import { addApi } from "../utils/add-api";
import { clearChildren } from "../utils/clear-children";
import { button } from "./button";

export const drawer = (options: any = {}) => {
    if (!options.labels) {
        options.labels = {};
    }

    const noo: any = {};
    const optId = options.id || doId(`drawer`);
    const optClass = options.class || ``;
    const optLabel = options.labels.trigger || `Show Drawer`;
    const optTrigger = getTarget(options.trigger);
    const optBack = options.labels.back != null ? options.labels.back : `Back`;
    const optTitle = options.labels.title || ``;
    const optSubtitle = options.labels.subtitle || ``;
    const optParent = options.parent || document.querySelector(`body`);
    const optBody = options.body;
    const optFooter = options.footer;
    const optClick = options.onclick || options.onClick || options.click || undefined;

    if (optTrigger) {
        noo.trigger = optTrigger;
    } else {
        noo.trigger = button({
            id: `${optId}-trigger`,
            label: optLabel,
            class: `dds__button--primary`,
        });
        optParent.appendChild(noo.trigger);
    }
    noo.comp = doElement(`<div class="dds__drawer ${optClass}" aria-hidden="true" data-dds="drawer" id="${optId}" data-trigger="#${noo.trigger.id}" tabindex="-1">`);
    noo.overlay = doElement(`<div class="dds__drawer__overlay" aria-hidden="true">`);
    noo.container = doElement(`<div class="dds__drawer__container">`);
    noo.containerHead = doElement(`<div class="dds__drawer__header">`);
    noo.containerHeadButton = doElement(`<button type="button" class="dds__drawer__close">${optBack}</button>`);
    noo.containerBody = doElement(`<div class="dds__drawer__body">`);
    noo.containerBodyTitle = doElement(`<h3 class="dds__drawer__title">${optTitle}</h3>`);
    noo.containerBodySubtitle = doElement(`<h5>${optSubtitle}</h5>`);
    noo.containerBodyContents = doElement(`<span class="ddsc__drawer__body__contents">`);
    noo.containerFooter = doElement(`<div class="dds__drawer__footer">`);

    noo.comp.appendChild(noo.overlay);
    noo.comp.appendChild(noo.container);
    noo.container.appendChild(noo.containerHead);
    noo.container.appendChild(noo.containerBody);
    noo.container.appendChild(noo.containerFooter);
    optBack && noo.containerHead.appendChild(noo.containerHeadButton);
    noo.containerBody.appendChild(noo.containerBodyTitle);
    noo.containerBody.appendChild(noo.containerBodySubtitle);
    noo.containerBody.appendChild(noo.containerBodyContents);

    if (optBody) {
        noo.containerBodyContents.appendChild(optBody);
    }
    if (optFooter) {
        noo.containerFooter.appendChild(optFooter);
    }
    if (optClick) {
        noo.comp.addEventListener(`ddsDrawerOpenEvent`, optClick);
    }
    if (!optTitle) {
        noo.containerBodyTitle.classList.add(`dds__d-none`);
    }

    noo.containerBodyTitle.set = (newText) => { 
        noo.containerBodyTitle.innerText = newText; 
        if (newText) {
            noo.containerBodyTitle.classList.remove(`dds__d-none`);
        } else {
            noo.containerBodyTitle.classList.add(`dds__d-none`);                
        }
    };
    noo.containerBodyTitle.get = (e) => { return noo.containerBodyTitle.innerText; };
    noo.containerFooter.clearChildren = () => { clearChildren(noo.containerFooter); };
    noo.containerBodyContents.clearChildren = () => { clearChildren(noo.containerBodyContents); };

    addApi({
        target: noo.comp, 
        isInternal: options.isInternal,
        api: {
            body: noo.containerBodyContents,
            title: noo.containerBodyTitle,
            footer: noo.containerFooter,
            trigger: noo.trigger,
            addEventListener: (sEvent, sCallback) => {
                noo.comp.addEventListener(sEvent, sCallback);
            },
            querySelector: (sQuery) => {
                return noo.comp.querySelector(sQuery);
            },
        },
    });

    return noo.comp;
};