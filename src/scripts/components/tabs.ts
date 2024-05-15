import { doId } from "../do-id";
import { doElement } from "../do-element";
import { addApi } from "../utils/add-api";
import { tabsItem } from "./tabs-item";

export const tabs = (options: any = {}) => {
    const noo: any = {};
    const optId = options.id || doId(`tabs`);
    const optClass = options.class || ``;
    const optTabs = options.tabs || [];

    noo.comp = doElement(`<div id="${optId}" class="dds__tabs ${optClass}" data-dds="tabs">`);
    noo.lists = doElement(`<div class="dds__tabs__list-container">`);
    noo.listsTabs = doElement(`<ul class="dds__tabs__list dds__tabs__list--overflow" role="tablist">`);
    noo.panes = doElement(`<div class="dds__tabs__pane-container">`);

    optTabs.forEach(oTab => {
        const newt = tabsItem({
            parentId: optId,
            ...oTab
        });
        noo.listsTabs.appendChild(newt.tab);
        noo.panes.appendChild(newt.pane);
    });

    noo.comp.appendChild(noo.lists);
    noo.comp.appendChild(noo.panes);
    noo.lists.appendChild(noo.listsTabs);

    addApi({
        target: noo.comp, 
        isInternal: options.isInternal,
        api: {
            tabs: noo.listsTabs,
            panes: noo.panes,
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