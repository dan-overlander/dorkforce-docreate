import { doId } from "../do-id";
import { doElement } from "../do-element";
import { addApi } from "../utils/add-api";
import { clearChildren } from "../utils/clear-children";
import { progressTrackerItem } from "./progress-tracker-item";

export const  progressTracker = (options: any = {}) => {
    const noo: any = {};
    const optId = options.id || doId(`progressTracker`);
    const optClass = options.class || ``;
    const optItems = options.items || [];

    noo.comp = doElement(`<div id="${optId}" class="dds__progress-tracker ${optClass}" data-dds="progress-tracker">`);
    noo.ol = doElement(`<ol class="dds__progress-tracker">`);

    const addItems = (items) => {
        items.forEach((item, itemIndex) => {
            const newItem = progressTrackerItem({
                item, 
            });
            noo.ol.appendChild(newItem);
        });
    };

    addItems(optItems);

    noo.comp.appendChild(noo.ol);

    addApi({
        target: noo.comp, 
        isInternal: options.isInternal,
        api: {
            dispose: (e) => {
                clearChildren(noo.ol);
            },
            init: (items) => {
                addItems(items);
            },
        },
    });
    // custom usage of addApi follows.  Normally, this'll be cleaned up within `doCreate.add`, but since progressTracker is not initialized, do it here:
    Object.keys(noo.comp.api).forEach(key => {
        noo.comp[key] = noo.comp.api[key];
    });
    delete noo.comp.api;

    return noo.comp;
};