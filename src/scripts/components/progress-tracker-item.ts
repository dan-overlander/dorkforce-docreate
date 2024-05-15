import { doId } from "../do-id";
import { doElement } from "../do-element";

export const progressTrackerItem = (options: any = {}) => {
    if (typeof options === `string`) {
        options = {
            item: ``,
        };
    }
    const optId = options.id || doId(`progressTrackerItem`);
    const optItem = options.item;

    const isComplete = optItem.complete != null ? optItem.complete : false;
    const isActive = optItem.active != null ? optItem.active : isComplete ? false : true;
    const isInactive = optItem.inactive != null ? optItem.inactive : false;
    const optClass = optItem.class || ``;
    let optSrOnly = optItem.srOnly;
    if (!optSrOnly) {
        optSrOnly = ``;
        if (isComplete) optSrOnly += ` complete`;
        if (isActive) optSrOnly += ` active`;
        if (isInactive) optSrOnly += ` inactive`;
    }
    const optName = optItem.name || ``;
    const optText = optItem.summary || optItem.text || ``;
    const optLink = optItem.link || `javascript:void(0);`;
    const optClick = optItem.onclick || optItem.onClick || optItem.click || undefined;
    const optCompleteClass = isComplete ? `dds__progress-tracker--complete` : ``;
    const optActiveClass = isActive ? `dds__progress-tracker--in-progress` : ``;
    const optInactiveClass = isInactive ? `` : `dds__progress-tracker--active`;

    const noo: any = {};
    noo.item = doElement(`<li class="dds__progress-tracker__item ${optCompleteClass} ${optActiveClass} ${optInactiveClass} ${optClass}">`)
    noo.item.srOnly = doElement(`<span class="dds__sr-only">${optSrOnly}</span>`)
    noo.item.circleIcon = doElement(`<span class="dds__progress-tracker__circle"><span class="dds__progress-tracker__icon"></span></span>`);
    noo.item.content = doElement(`<div class="dds__progress-tracker__content"></div>`)
    noo.item.content.name = isInactive ? doElement(`<span class="dds__progress-tracker__step-name">${optName}</span>`) : doElement(`<a href="${optLink}">${optName}</a>`);
    noo.item.content.text = doElement(`<span>${optText}</span>`);
    if (optClick) {
        noo.item.content.name.addEventListener(`click`, optClick);
    }

    noo.item.appendChild(noo.item.srOnly);
    noo.item.appendChild(noo.item.circleIcon);
    noo.item.appendChild(noo.item.content);
    noo.item.content.appendChild(noo.item.content.name);
    noo.item.content.appendChild(noo.item.content.text);

    return noo.item;
};