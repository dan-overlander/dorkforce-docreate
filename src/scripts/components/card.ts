import { doId } from "../do-id";
import { doElement } from "../do-element";

export const card = (options: any = {}) => {
    const noo: any = {};
    const optId = options.id || doId(`card`);
    const optClass = options.class || ``;
    const optMedia = options.media;
    const optIcon = options.icon || ``;
    const optTitle = options.title || ``;
    const optSubtitle = options.subtitle || ``;
    const optBody = options.body || ``;
    let optFooter = options.footer || [];
    if (optFooter.constructor !== Array) {
        optFooter = [optFooter];
    }

    noo.comp = doElement(`<div id="${optId}" class="dds__card ${optClass}">`);
    noo.content = doElement(`<div class="dds__card__content">`);
    if (optMedia) {
        noo.media = doElement(`<div class="dds__card__media">`);
        if (!optMedia.src) {
            noo.media.appendChild(optMedia);
        } else {
            const nooImage = doElement(`
                <img
                    class="dds__card__media__item"
                    src="${optMedia.src}"
                    alt="${optMedia.alt || ``}"
                />
            `);
            noo.media.appendChild(nooImage);
        }
        noo.comp.appendChild(noo.media);
    }
    noo.header = doElement(`
        <div class="dds__card__header">
            ${optIcon ? `<em class="dds__icon dds__icon--${optIcon} dds__card__header__icon"></em>` : ``}
            <span class="dds__card__header__text">
                <h5 class="dds__card__header__title">${optTitle}</h5>
                <span class="dds__card__header__subtitle">${optSubtitle}</span>
            </span>
        </div>
    `);
    noo.body = doElement(`<div class="dds__card__body">${optBody}</div>`);
    noo.footer = doElement(`<div class="dds__card__footer">`);
    if (optFooter.length > 0) {
        let fItem;
        optFooter.forEach((oFoot, footI) => {
            if (oFoot.href) {
                fItem = doElement(`
                    <a id="${optId}_footer${footI}" href="${oFoot.href}" class="dds__link--standalone dds__card__footer__item" ${oFoot.target ? `target="${oFoot.target}"` : ``}>
                        ${oFoot.label || oFoot.innerText}
                    </a>
                `);
                fItem.appendChild(doElement(`<span class="dds__icon dds__icon--arrow-right" aria-hidden="true"></span>`));
                noo.footer.appendChild(fItem);
            } else if (oFoot.label && oFoot.onclick) {
                fItem = doElement(`
                    <button id="${optId}_footer${footI}" class="dds__button dds__button--sm dds__card__footer__item" type="button">
                        ${oFoot.label}
                    </button>
                `);
                fItem.addEventListener(`click`, oFoot.onclick);
                noo.footer.appendChild(fItem);
            } else {
                console.error(`DO: Unable to create card footer item.  
                    Send either an HTMLElement, or an object with href and label, or an object with label and onclick`);
            }
        })
    }

    noo.comp.appendChild(noo.content);
    noo.content.appendChild(noo.header);
    noo.content.appendChild(noo.body);
    noo.content.appendChild(noo.footer);
    return noo.comp;
};