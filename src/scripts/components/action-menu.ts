import { doId } from "../do-id";
import { doElement } from "../do-element";
import { doObserve } from "../do-observe";
import { doListener } from "../do-listener";
import { getFromDom } from "../utils/get-from-dom";
import { addChevronClasses } from "../utils/add-chevron-classes";
import { actionMenuItem } from "./action-menu-item";

export const actionMenu = (options: any = {}) => {
    const noo: any = {};
    const optId = options.id || doId(`ActionMenu`);
    const optClass = options.class || ``;
    let triggerDomStatus: any = getFromDom(options.trigger);
    let optTrigger;

    if (triggerDomStatus.found) {
        optTrigger = triggerDomStatus.element;
    } else {
        if (typeof options.trigger === `string`) {
            doObserve.addition(options.trigger, (el: any) => {
                el.addEventListener(`click`, () => {
                    noo.actionMenu.toggle();
                });
            });
        } else {
            optTrigger = options.trigger;
        }
    }
    if (!optTrigger.id) {
        optTrigger.id = doId(optId);
    }
    const optChevron = options.chevron || false;
    const optItems = options.items || [];

    noo.actionMenu = doElement(
        `<div id="${optId}" class="dds__action-menu ${optClass}" data-trigger="#${optTrigger.id}" data-dds="action-menu">`
    );

    if (optChevron) {
        addChevronClasses();
        const handleActionClick = (e) => {
            e.target.querySelector(`.dds__icon`).classList.toggle(`do__chevron-rotated`);
        };
        noo.chevron = doElement(`<em class="dds__icon dds__icon--chevron-down do__chevron">`);
        optTrigger.appendChild(noo.chevron);
        doListener(`#${optId}`, `ddsActionMenuOpenEvent`, handleActionClick);
        doListener(`#${optId}`, `ddsActionMenuCloseEvent`, handleActionClick);
    }

    noo.container = doElement(
        `<div class="dds__action-menu__container" tabindex="-1" role="presentation" aria-hidden="true">`
    );
    noo.menu = doElement(`<ul class="dds__action-menu__menu" role="menu" tabindex="-1">`);
    noo.menuLi = doElement(`<li role="presentation">`);
    noo.group = doElement(`<span id="${optId}-group">`);
    noo.groupUl = doElement(
        `<ul id="${optId}-groupUl" class="ddsc__action-menu--groupUl" role="group" aria-labelledby="${noo.group.getAttribute(
            `id`
        )}">`
    );

    if (!triggerDomStatus.found) {
        noo.actionMenu.appendChild(optTrigger);
    }
    noo.actionMenu.appendChild(noo.container);
    noo.container.appendChild(noo.menu);
    noo.menu.appendChild(noo.menuLi);
    noo.menuLi.appendChild(noo.group);
    noo.group.appendChild(noo.groupUl);
    noo.actionMenu.appendChild = (amItemEl) => {
        noo.actionMenu.querySelector(`.ddsc__action-menu--groupUl`).appendChild(amItemEl);
    };

    optItems.forEach((oItem) => {
        const newAmItem = actionMenuItem(oItem);
        noo.actionMenu.appendChild(newAmItem);
    });

    return noo.actionMenu;
};
