import { doId } from "../do-id";
import { doElement } from "../do-element";

export const moreLess = (options: any = {}) => {
    const types = {
        related: `related`,
        list: `list`,
        bottom: `bottom`,
        inline: `inline`,
    };
    const noo: any = {};
    const optId = options.id || doId(`tag`);
    const optType = options.type && options.type.toLowerCase() || types.related;
    const optClass = options.class || `dds__more-less__button ${optType !== types.inline ? `dds__more-less__button--standalone` : ``}`;
    const optLabel = options.labels && options.labels.more || options.label || ``;
    const optLabelLess = options.labels && options.labels.less || options.label || ``;
    const optTarget = options.target || options.body || ``;
    const optIntro = options.intro || ``;

    let typeClass = ``;
    switch (optType) {
        case types.list:
            typeClass = `dds__more-less--list`;
            break;
        case types.inline:
            typeClass = `dds__more-less--inline`;
            break;
    }

    noo.comp = doElement(`<span id="${optId}" class="${typeClass}" data-dds="more-less">`);
    noo.button = doElement(`<button class="${optClass}" type="button" aria-expanded="false">`);
    noo.buttonMore = doElement(`<span class="dds__more-less__button--more">${optLabel}</span>`);
    noo.buttonLess = doElement(`<span class="dds__more-less__button--less">${optLabelLess}</span>`);
    noo.target = typeof optTarget === `string` ? doElement(`<span class="dds__more-less__target">${optTarget}`) : optTarget;
    noo.ellipsis = doElement(`<span class="dds__more-less__ellipsis">...</span>`);
    if (optIntro) {
        noo.intro = typeof optIntro === `string` ? doElement(`<span>${optIntro}</span>`) : optIntro;
        noo.comp.appendChild(noo.intro);
    }

    noo.button.appendChild(noo.buttonMore);
    noo.button.appendChild(noo.buttonLess);
    if (optType === types.list) {
        noo.comp.appendChild(noo.target);
        noo.comp.appendChild(noo.button);
    } else if (optType === types.bottom || optType === types.inline) {
        noo.comp.appendChild(noo.target);
        noo.comp.appendChild(noo.ellipsis);
        noo.comp.appendChild(noo.button);
    } else {
        noo.comp.appendChild(noo.button);
        noo.comp.appendChild(noo.target);
    }

    return noo.comp;
};