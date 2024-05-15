import { doId } from "../do-id";
import { doElement } from "../do-element";
import { getDataAttributes } from "../utils/get-data-attributes";
import { iconName } from "../utils/icon-name";

export const sideNav = (options: any = {}) => {
    const noo: any = {};
    const optId = options.id || doId(`sidenav`);
    const optClass = options.class || ``;
    const optAriaLabel = options.ariaLabel || ``;
    const count = {
        menus: 0,
        groups: 0,
        items: 0,
    };

    const newMenu = (mInfo: any = {}) => {
        const elId = `${optId}-${mInfo.id || doId(`menu`)}`;
        const elClass = `${mInfo.class || ``} ddsc__menu-${count.menus}`;
        const el: any = {};

        el.ul = doElement(`<ul id="${elId}" class="dds__side-nav__menu ${elClass}">`);

        count.menus++;
        return el.ul;
    };
    const newItem = (iInfo) => {
        const elId = `${optId}-${iInfo.id || iInfo.label.replace(/ /g, ``) || doId(`item`)}`;
        const elClass = `${iInfo.class || ``} ddsc__item-${count.items}`;
        const elLink = iInfo.link || `javascript:void(0);`;
        const elClick = iInfo.onclick || iInfo.onClick || iInfo.click || undefined;
        const optIcon = iconName(iInfo.icon);
        const optLabel = iInfo.label || ``;
        const optDataAttributes = getDataAttributes(iInfo);
        const el: any = {};

        el.sItem = doElement(`<li id="${elId}" class="dds__side-nav__item ${elClass}" ${optDataAttributes}>`);
        el.sItemLink = doElement(`<a href="${elLink}">`);
        el.sItemLinkIcon = doElement(`<span class="dds__icon dds__side-nav__icon ${optIcon}" aria-hidden="true"></span>`);
        el.sItemLinkLabel = doElement(`<span>${optLabel}</span>`);

        el.sItem.appendChild(el.sItemLink);
        if (optIcon) el.sItemLink.appendChild(el.sItemLinkIcon);
        el.sItemLink.appendChild(el.sItemLinkLabel);

        if (elClick) {
            el.sItem.addEventListener(`click`, elClick);
        }

        count.items++;
        return el.sItem;
    };
    const newGroup = (gInfo) => {
        const elId = `${optId}-${gInfo.id || gInfo.label.replace(/ /g, ``) || doId(`group`)}`;
        const elClass = `${gInfo.class || ``} ddsc__group-${count.groups}`;
        const optExpanded = gInfo.expanded || false;
        const optIcon = iconName(gInfo.icon);
        const optLabel = gInfo.label || ``;
        const el: any = {};

        el.group = doElement(`<li id="${elId}" class="dds__side-nav__group ${elClass}">`);
        el.groupButton = doElement(`<button type="button" aria-haspopup="true" aria-expanded="${optExpanded}">`);
        el.groupButtonIcon = doElement(`<span class="dds__icon dds__side-nav__icon ${optIcon}" aria-hidden="true"></span>`);
        el.groupButtonLabel = doElement(`<span>${optLabel}</span>`);

        el.group.appendChild(el.groupButton);
        if (optIcon) el.groupButton.appendChild(el.groupButtonIcon);
        el.groupButton.appendChild(el.groupButtonLabel);

        count.groups++;
        return el.group;
    };
    const convertParent = (parenty) => {
        if (parenty && typeof parenty === `string` && parenty.match(/(#|\.)/)) {
            console.error(`parent must be an element or an ID without #`);
        }
        let optParent;
        if (parenty) {
            optParent = typeof parenty === `string` ? noo.comp.querySelector(`#${optId}-${parenty}`) : parenty;
        }
        return optParent;
    };

    noo.comp = doElement(`<nav id="${optId}" data-dds="side-nav" class="dds__side-nav__wrapper ${optClass}" aria-label="${optAriaLabel}">`);
    noo.section = doElement(`<section class="dds__side-nav">`);
    noo.toggle = doElement(`<div class="dds__side-nav__toggle">`);
    noo.toggleLeft = doElement(`<button type="button" aria-label="collapse side navigation">`);
    noo.toggleLeftLabel = doElement(`<span class="dds__icon dds__side-nav__icon dds__icon--chevron-left"></span>`);
    noo.toggleRight = doElement(`<button type="button" aria-label="collapse side navigation">`);
    noo.toggleRightLabel = doElement(`<span class="dds__icon dds__side-nav__icon dds__icon--chevron-right"></span>`);

    noo.comp.appendChild(noo.section);
    noo.comp.appendChild(noo.toggle);
    noo.toggle.appendChild(noo.toggleLeft);
    noo.toggle.appendChild(noo.toggleRight);
    noo.toggleLeft.appendChild(noo.toggleLeftLabel);
    noo.toggleRight.appendChild(noo.toggleRightLabel);

    noo.comp.addMenu = (options: any = {}) => {
        let optParent = convertParent(options.parent) || noo.section;
        optParent.append(newMenu(options));
    };
    noo.comp.addGroup = (options: any = {}) => {
        let optParent = convertParent(options.parent) || noo.section;
        optParent.append(newGroup(options));
    };
    noo.comp.addItem = (options: any = {}) => {
        let optParent = convertParent(options.parent) || noo.section;
        optParent.append(newItem(options));
    };

    return noo.comp;
};