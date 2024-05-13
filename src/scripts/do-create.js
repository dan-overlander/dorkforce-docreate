import { doObserve } from "./do-observe.js";
import { doXhr } from "./do-xhr.js";

export const doCreate = {
    add: (options = {}) => {
        if (!options) {
            options = {};
        }
        if (typeof options === `string`) {
            options = {
                method: options,
            }
        }
        const optMethod = options.method;
        const optOptions = options.options || {};
        const optDdsOptions = options.ddsOptions;
        let optParent;
        if (options.target && !options.parent) {
            options.parent = options.target;
        }
        if (typeof options.parent === `string`) {
            optParent = document.querySelector(options.parent);
        } else {
            optParent = options.parent || document.querySelector(`body`);
        }

        // Should this stay !options.parent ?        
        if (!optOptions.parent) {
            optOptions.parent = optParent;
        }

        // tell other doCreate methods that we're automatically initializing this component...
        optOptions.isInternal = true;

        let newEl;
        if (doCreate[optMethod]) {
            newEl = doCreate[optMethod](optOptions);
        } else {
            newEl = doCreate.element(optMethod);
        }
        if (!newEl) {
            console.error(`DO: Error creating element ${optMethod}`);
            return;
        }
        if (!document.getElementById(newEl.id)) {
            optParent.appendChild(newEl);
        }
        const ddsMethod = doCreate.utils.capitalize(optMethod);
        if (DDS[ddsMethod]) {
            if (!newEl.getAttribute(`data-dds`) && newEl.querySelector(`[data-dds]:not([data-dds=""])`)) {
                newEl = newEl.querySelector(`[data-dds]:not([data-dds=""])`);
            }
            DDS[ddsMethod](newEl, optDdsOptions);
            if (newEl.api) {
                Object.keys(newEl.api).forEach(key => {
                    if (newEl[ddsMethod]) {
                        newEl[ddsMethod][key] = newEl.api[key];
                    } else {
                        newEl[key] = newEl.api[key];
                    }
                });
                delete newEl.api;
            }
            const newComp = newEl[ddsMethod];
            if (newComp) {
                newComp.ddsOptions = optDdsOptions;
            }
            if (newEl.doCallback) {
                newEl.doCallback();
                newEl.doCallback = null;
            }
            return newComp || newEl;
        }
        return newEl;
    },
    accordion: (options = {}) => {
        const noo = {};
        const optId = options.id || doCreate.id(`accordion`);
        const optItems = options.items || [];
        const optClass = options.class || ``;

        const addItem = (item, itemIndex) => {
            const itemHead = item.head || ``;
            const itemBody = item.body || ``;
            const itemExpanded = item.expanded != null ? item.expanded : false;
            let itemClass = item.class || ``;

            if (itemClass.indexOf(`expanded`) === -1 && itemExpanded) {
                itemClass += ` dds__accordion__item--expanded`;
            }

            const nooItem = {};
            nooItem.item = doCreate.element(`<div class="dds__accordion__item ${itemClass}">`);
            nooItem.itemHead = doCreate.element(`<h5 class="dds__accordion__heading">`);
            nooItem.itemHeadButton = doCreate.element(`<button
                type="button"
                id="accordion-item-trigger-${optId}-${itemIndex}"
                class="dds__accordion__button"
                aria-expanded="false"
                aria-controls="accordion-item-content-${optId}-${itemIndex}"
            >
                ${itemHead}
            </button>
          `);
            nooItem.itemContent = doCreate.element(`<div
              id="accordion-item-content-${optId}-${itemIndex}"
              class="dds__accordion__content"
              role="region"
              aria-labelledby="accordion-item-trigger-${optId}-${itemIndex}"
            >`);
            nooItem.itemContentBody = doCreate.element(`
                <div class="dds__accordion__body">
                    ${typeof itemBody !== "object" ? itemBody : ``}
                </div>
            `);
            if (typeof itemBody === `object`) {
                nooItem.itemContentBody.appendChild(itemBody);
            }

            noo.acc.appendChild(nooItem.item);
            nooItem.item.appendChild(nooItem.itemHead);
            nooItem.itemHead.appendChild(nooItem.itemHeadButton);
            nooItem.item.appendChild(nooItem.itemContent);
            nooItem.itemContent.appendChild(nooItem.itemContentBody);
        };

        noo.acc = doCreate.element(`<div role="region" id="${optId}" class="dds__accordion ${optClass}" data-dds="accordion">`);
        optItems.forEach((item, itemIndex) => {
            addItem(item, itemIndex);
        });

        doCreate.utils.addApi({
            target: noo.acc,
            isInternal: options.isInternal,
            api: {
                appendChild: (newItem) => {
                    optItems.push(newItem);
                    addItem(newItem, optItems.length);
                    noo.acc.Accordion.dispose();
                    DDS.Accordion(noo.acc);
                },
            }
        })

        return noo.acc;
    },
    actionMenu: (options = {}) => {
        const noo = {};
        const optId = options.id || doCreate.id(`ActionMenu`);
        const optClass = options.class || ``;
        let triggerDomStatus = doCreate.utils.getFromDom(options.trigger);
        let optTrigger;

        if (triggerDomStatus.found) {
            optTrigger = triggerDomStatus.element;
        } else {
            if (typeof options.trigger === `string`) {
                doObserve.addition(options.trigger, (el) => {
                    el.addEventListener(`click`, (e) => {
                        noo.actionMenu.toggle();
                    });
                });
            } else {
                optTrigger = options.trigger;
            }
        }
        if (!optTrigger.id) {
            optTrigger.id = doCreate.id(optId);
        }
        const optChevron = options.chevron || false;
        const optItems = options.items || [];

        noo.actionMenu = doCreate.element(`<div id="${optId}" class="dds__action-menu ${optClass}" data-trigger="#${optTrigger.id}" data-dds="action-menu">`);

        if (optChevron) {
            doCreate.utils.addChevronClasses();
            const handleActionClick = (e) => {
                e.target.querySelector(`.dds__icon`).classList.toggle(`do__chevron-rotated`);
            }
            noo.chevron = doCreate.element(`<em class="dds__icon dds__icon--chevron-down do__chevron">`);
            optTrigger.appendChild(noo.chevron);
            doCreate.listener(`#${optId}`, `ddsActionMenuOpenEvent`, handleActionClick);
            doCreate.listener(`#${optId}`, `ddsActionMenuCloseEvent`, handleActionClick);
        }

        noo.container = doCreate.element(`<div class="dds__action-menu__container" tabindex="-1" role="presentation" aria-hidden="true">`);
        noo.menu = doCreate.element(`<ul class="dds__action-menu__menu" role="menu" tabindex="-1">`);
        noo.menuLi = doCreate.element(`<li role="presentation">`);
        noo.group = doCreate.element(`<span id="${optId}-group">`);
        noo.groupUl = doCreate.element(`<ul id="${optId}-groupUl" class="ddsc__action-menu--groupUl" role="group" aria-labelledby="${noo.group.getAttribute(`id`)}">`);

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

        optItems.forEach(oItem => {
            const newAmItem = doCreate.actionMenuItem(oItem);
            noo.actionMenu.appendChild(newAmItem);
        });

        return noo.actionMenu;
    },
    actionMenuItem: (options = {}) => {
        const noo = {};
        const optLabel = options.label || `Item Label`;
        const optDataValue = options.value;
        const optClass = options.class || ``;
        const optClick = options.onclick || options.onClick || options.click || undefined;
        const optId = options.id || doCreate.id(optLabel.replace(/[^0-9a-zA-Z]+/, ``));
        const optIcon = options.icon || `minus-minimize`;
        const asOption = options.value != null || false;
        const optDataAttributes = doCreate.utils.getDataAttributes(options);
        doCreate.style(`.pointer-none {
            pointer-events: none;
        }`);

        noo.item = doCreate.element(`<li class="${asOption ? `dds__action-menu__option` : `dds__action-menu__item`}" role="none">`);
        noo.itemButton = doCreate.element(`<button id="${optId}" 
            type="button"
            class="${optClass}" 
            role="${asOption ? `menuitemcheckbox` : `menuitem`}"
            tabindex="-1"
            aria-disabled="false"
            aria-checked="false"
            ${optDataValue ? `data-value="${optDataValue}"` : ``}
            ${optDataAttributes}
        >`);

        noo.itemSvg = doCreate.element(`<svg class="dds__action-menu__icon pointer-none" aria-hidden="${optIcon ? `false` : `true`}">`);
        noo.itemSvgUse = doCreate.icon({
            icon: optIcon,
            class: `dds__button__icon--start`,
        });
        noo.itemText = doCreate.element(`<span class="pointer-none">${optLabel}</span>`);

        noo.item.appendChild(noo.itemButton);
        noo.itemButton.appendChild(noo.itemSvg);
        noo.itemButton.appendChild(noo.itemText);
        noo.itemSvg.appendChild(noo.itemSvgUse);
        if (optClick) {
            doCreate.listener(`#${optId}`, `click`, optClick);
        }
        return noo.item;
    },
    badge: (options = {}) => {
        const noo = {};
        const optId = options.id || doCreate.id(`badge`);
        const optLabel = options.label || ``;
        const optClass = options.class || ``;

        noo.comp = doCreate.element(`<span id="${optId}" class="dds__badge ${optClass}">`);
        noo.label = doCreate.element(`<span class="dds__badge__label">${optLabel}</span>`);

        noo.comp.appendChild(noo.label);
        return noo.comp;
    },
    blockquote: (options = {}) => {
        const noo = {};
        const optId = options.id || doCreate.id(`blockquote`);
        const optClass = options.class || ``;
        const optQuote = options.quote || ``;
        const optCaption = options.caption || undefined;
        const optAuthor = options.author || ``;
        const optCite = options.cite || ``;
        
        noo.comp = doCreate.element(`<figure id="${optId}" class="dds__blockquote ${optClass}">`);
        noo.bquote = doCreate.element(`<blockquote>`);
        noo.bquoteP = doCreate.element(`<p>${optQuote}</p>`);
        if (optCaption != null) {
            const captionDash = optCaption.length > 0 ? `— ` : ``;
            noo.fig = doCreate.element(`<figcaption>${captionDash}${optCaption}</figcaption>`);
        } else {
            const citeDash = optAuthor.length > 0 || optCite.length > 0 ? `— ` : ``;
            noo.fig = doCreate.element(`<figcaption>${citeDash}${optAuthor} </figcaption>`);
            noo.cite = doCreate.element(`<cite>${optCite}</cite>`);
            noo.fig.appendChild(noo.cite);
        }

        noo.comp.appendChild(noo.bquote);
        noo.comp.appendChild(noo.fig);
        noo.bquote.appendChild(noo.bquoteP);

        return noo.comp;
    },
    button: (options = {}) => {
        if (typeof options === `string`) {
            options = {
                label: options,
            }
        }
        const noo = {};
        const optId = options.id || doCreate.id(`button`);
        const optChevron = options.chevron || undefined;
        const optClass = options.class || ``;
        const optClick = options.onclick || options.onClick || options.click || undefined;
        const optLabel = options.label || ``;
        const optRole = options.role || `button`;
        const optType = options.type || `button`;
        const optTitle = options.title || ``;
        const optTabIndex = options.tabindex || 0;
        const optAriaLabel = options.ariaLabel || ``;
        const optAriaDescribedBy = options.ariaDescribedBy || ``;
        const optDisabled = options.disabled || false;
        const optIcon = options.icon;
        const iconIsString = optIcon && typeof optIcon === `string`;
        const iconObjectName = !iconIsString && optIcon ? optIcon.name : undefined;
        const iconObjectClass = !iconIsString && optIcon && optIcon.class ? optIcon.class : ``;
        const bIcon = {
            name: iconIsString ? optIcon : iconObjectName,
            class: iconObjectClass
        };
        const optDataAttributes = doCreate.utils.getDataAttributes(options);

        noo.button = doCreate.element(`
            <button 
                id="${optId}"
                class="dds__button ${optClass}"
                type="${optType}"
                role="${optRole}"
                tabindex="${optTabIndex}"
                aria-label="${optAriaLabel}"
                ${optTitle ? `title="${optTitle}"` : ``}
                ${optDisabled ? `disabled="true"` : ``}
                ${optAriaDescribedBy ? `aria-described-by="${optAriaDescribedBy}"` : ``}
                ${optDataAttributes}
            >
                ${optLabel}
            </button>
        `);
        if (bIcon.name) {
            doCreate.style(`.do__button__icon {
                pointer-events: none;
            }`);
            doCreate.style(`.do__button__icon-label {
                margin-right: 0.5rem;
            }`);
            noo.icon = doCreate.element(`<span class="dds__icon dds__icon--${bIcon.name} do__button__icon ${optLabel.length > 0 ? `do__button__icon-label` : ``} ${bIcon.class}" aria-hidden="true">`);
            if (optIcon.class && optIcon.class.indexOf(`--end`) > -1) {
                noo.button.appendChild(noo.icon);
            } else {
                noo.button.prepend(noo.icon);
            }
        }
        if (optClick) {
            doCreate.listener(`#${optId}`, `click`, optClick);
        }
        if (optChevron) {
            doCreate.utils.addChevronClasses();
            if (!optChevron.open || !optChevron.close || !optChevron.selector) {
                console.error(`DO: options.chevron should identify the properties: selector<selector>, open<event>, and close<event>`);
            }
            const handleActionClick = () => {
                document.getElementById(optId).querySelector(`.dds__icon`).classList.toggle(`do__chevron-rotated`);
            }
            const optSelector = optChevron.selector || `#${optId}`;
            const optOpen = optChevron.open || `ddsModalOpenedEvent`;
            const optClose = optChevron.close || `ddsModalClosedEvent`;
            noo.chevron = doCreate.element(`<em class="dds__icon dds__icon--chevron-down do__chevron">`);
            noo.button.appendChild(noo.chevron);

            let selectedElement;
            const triggerInDomStatus = doCreate.utils.getFromDom(optSelector);
            const attachListeners = () => {
                selectedElement.addEventListener(optOpen, handleActionClick);
                selectedElement.addEventListener(optClose, handleActionClick);                
            };
            if (triggerInDomStatus.found) {
                selectedElement = triggerInDomStatus.element;
                attachListeners();
            } else if (!triggerInDomStatus.found && doObserve) {
                doObserve.addition(optSelector, (e) => {
                    selectedElement = doCreate.utils.getTarget(optSelector);
                    attachListeners();
                });
            } else {
                // NOTE: can fix this by adding observer behavior
                console.error(`DO: Button: Unable to attach listeners to handle chevron animation`)
            }
        }

        return noo.button;
    },
    breadcrumb: (options = {}) => {
        const noo = {};
        const optId = options.id || doCreate.id(`breadcrumb`);
        const optAriaLabel = options[`aria-label`] || `breadcrumb`;
        const optItems = options.items || [];

        noo.comp = doCreate.element(`<nav id="${optId}" data-dds="dds__breadcrumb" aria-label="${optAriaLabel}">`);
        noo.ol = doCreate.element(`<ol id="${optId}_ol" class="dds__breadcrumb">`);
        noo.olHome = doCreate.element(`<li class="dds__breadcrumb__item">`);
        noo.olHomeA = doCreate.element(`<a href="javascript:;">`);
        noo.olHomeIcon = doCreate.element(`<span class="dds__icon dds__icon--home dds__breadcrumb__home-icon" aria-hidden="true">`);
        noo.olHomeSr = doCreate.element(`<span class="dds__sr-only">Home</span>`);

        optItems.forEach(oItem => {
            const item = doCreate.element(`<li class="dds__breadcrumb__item"><a href="javascript:;">${oItem}</a></li>`);
            noo.ol.appendChild(item);
        });

        noo.comp.appendChild(noo.ol);
        noo.ol.prepend(noo.olHome);
        noo.olHome.appendChild(noo.olHomeA);
        noo.olHomeA.appendChild(noo.olHomeIcon);
        noo.olHomeA.appendChild(noo.olHomeSr);

        return noo.comp;
    },
    card: (options = {}) => {
        const noo = {};
        const optId = options.id || doCreate.id(`card`);
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

        noo.comp = doCreate.element(`<div id="${optId}" class="dds__card ${optClass}">`);
        noo.content = doCreate.element(`<div class="dds__card__content">`);
        if (optMedia) {
            noo.media = doCreate.element(`<div class="dds__card__media">`);
            if (!optMedia.src) {
                noo.media.appendChild(optMedia);
            } else {
                const nooImage = doCreate.element(`
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
        noo.header = doCreate.element(`
            <div class="dds__card__header">
                ${optIcon ? `<em class="dds__icon dds__icon--${optIcon} dds__card__header__icon"></em>` : ``}
                <span class="dds__card__header__text">
                    <h5 class="dds__card__header__title">${optTitle}</h5>
                    <span class="dds__card__header__subtitle">${optSubtitle}</span>
                </span>
            </div>
        `);
        noo.body = doCreate.element(`<div class="dds__card__body">${optBody}</div>`);
        noo.footer = doCreate.element(`<div class="dds__card__footer">`);
        if (optFooter.length > 0) {
            let fItem;
            optFooter.forEach((oFoot, footI) => {
                if (oFoot.href) {
                    fItem = doCreate.element(`
                        <a id="${optId}_footer${footI}" href="${oFoot.href}" class="dds__link--standalone dds__card__footer__item" ${oFoot.target ? `target="${oFoot.target}"` : ``}>
                            ${oFoot.label || oFoot.innerText}
                        </a>
                    `);
                    fItem.appendChild(doCreate.element(`<span class="dds__icon dds__icon--arrow-right" aria-hidden="true"></span>`));
                    noo.footer.appendChild(fItem);
                } else if (oFoot.label && oFoot.onclick) {
                    fItem = doCreate.element(`
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
    },
    carousel: (options = {}) => {
        // finish later
        const noo = {};
        const optId = options.id || doCreate.id(`carousel`);
        const optClass = options.class || ``;
        const optAriaLabel = options.ariaLabel || ``;
        const optPrevious = options.previous || `Previous Page`;
        const optNext = options.next || `Next Page`;
        const optItems = options.items || [];

        noo.comp = doCreate.element(`<div class="dds__carousel" id="${optId}" aria-label="${optAriaLabel}" role="region" aria-atomic="false" data-dds="carousel">`);
        noo.comp.controls = doCreate.element(`<div class="dds__carousel__controls" role="group">`);
        noo.comp.controls.prev = doCreate.button({
            class: `dds__button__icon dds__button--editorial-light dds__carousel__controls__prev`,
            icon: `chevron-left`,
            label: `<span class="dds__sr-only">${optPrevious}</span>`,
        });
        noo.comp.controls.next = doCreate.button({
            class: `dds__button__icon dds__button--editorial-light dds__carousel__controls__next`,
            icon: `chevron-right`,
            label: `<span class="dds__sr-only">${optNext}</span>`,
        });
        noo.comp.wrapper = doCreate.element(`<div class="dds__carousel__items-wrapper">`);
        noo.comp.wrapper.track = doCreate.element(`<div class="dds__carousel__track" role="presentation">`);

        // for each item, append it to the track
        noo.comp.appendChild(noo.comp.controls);
        noo.comp.appendChild(noo.comp.wrapper);
        noo.comp.controls.appendChild(noo.comp.controls.prev);
        noo.comp.controls.appendChild(noo.comp.controls.next);
        noo.comp.wrapper.appendChild(noo.comp.wrapper.track);

        doCreate.utils.addApi({
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
                        const newItem = doCreate.carouselItem(item);
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
    },
    carouselItem: (options = {}) => {
        const noo = {};
        const optLabel = options.label || `Carousel Item`;
        const optId = options.id || doCreate.id(optLabel.replace(/[^0-9a-zA-Z]+/, ``));
        const optClass = options.class || ``;
        const optAriaLabel = options.ariaLabel || optLabel;
        const optBody = options.body || ``;
        if (!Array.isArray(optBody.constructor)) {
            try {
                optBody = doCreate.element(optBody);
            } catch (e) {
                console.error(`DO:carouselItem: unable to convert optBody to element`);
            }
        }

        noo.item = doCreate.element(`<div id="${optId}" class="dds__carousel__item ${optClass}" role="group" aria-label="${optAriaLabel}">`);
        noo.item.appendChild(optBody);

        return noo.item;
    },    
    checkbox: (options = {}) => {
        const noo = {};
        const optId = options.id || doCreate.id(`checkbox`);
        const optLabel = options.label || ``;
        const optClass = options.class || ``;
        const optClick = options.onclick || options.onClick || options.click || undefined;
        const optValue = options.value || ``;
        const optChecked = options.checked || false;
        const optRequired = options.required || false;
        const optError = options.error || `Invalid Entry`;
        const getCheckboxEl = () => {
            const thisCheckbox = document.getElementById(noo.input.id);
            if (!thisCheckbox) {
                console.error(`DO: Element #${noo.input.id} was not found`);
                return;
            }
            return thisCheckbox;
        }
        const optDataAttributes = doCreate.utils.getDataAttributes(options);

        // doCreate new components
        noo.comp = doCreate.element(`<div id="${optId}" class="dds__checkbox ${optClass}">`);
        noo.label = doCreate.element(`<label id="${optId}-label" class="dds__checkbox__label" for="${optId}-input">`);
        noo.input = doCreate.element(`<input type="checkbox" tabindex="0" id="${optId}-input" name="${optId}-name" class="dds__checkbox__input" ${optDataAttributes}>`);
        if (optValue) noo.input.value = optValue;
        if (optChecked) noo.input.setAttribute(`checked`, optChecked);
        if (optRequired) noo.input.setAttribute(`required`, true);
        noo.content = doCreate.element(`<span id="${optId}-content">${optLabel}</span>`);
        noo.error = doCreate.element(`<div id="${optId}-error" class="dds__invalid-feedback">${optError}</div>`);

        // append new elements together
        noo.comp.appendChild(noo.label);
        noo.comp.appendChild(noo.error);
        noo.label.appendChild(noo.input);
        noo.label.appendChild(noo.content);

        // add methods
        noo.comp.indeterminate = (state) => {
            // must return to verify this method
            if (state == null) {
                console.error(`DO: indeterminate: must pass state`);
                return;
            }
            const thisCheckbox = getCheckboxEl();
            thisCheckbox.indeterminate = state;
            thisCheckbox.setAttribute(`aria-checked`, state ? `mixed` : `false`);
        };
        noo.comp.check = (state = true) => {
            const thisCheckbox = getCheckboxEl();
            thisCheckbox.checked = state;
            thisCheckbox.setAttribute(`aria-checked`, state);
        };
        if (optClick) {
            doCreate.listener(`#${noo.input.id}`, `change`, optClick);
        }

        // return base component
        return noo.comp;
    },
    datePicker: (options = {}) => {
        const noo = {};
        const optId = options.id || doCreate.id(`datepicker`);
        const optClass = options.class || ``;
        const optRequired = options.required || false;
        const optLabel = options.label || ``;
        const optPlaceholder = options.placeholder || `Enter the date`;
        const optHelper = options.helper || ``;
        const optError = options.error || ``;
        const optDataAttributes = doCreate.utils.getDataAttributes(options);

        noo.comp = doCreate.element(`<div id="${optId}" class="dds__date-picker ${optClass}" data-dds="date-picker">`);
        noo.label = doCreate.element(`<label id="${optId}-label" for="${optId}-control" class="dds__label ${optRequired ? `dds__label--required` : ``}">${optLabel}</label>`);
        noo.wrapper = doCreate.element(`<div class="dds__date-picker__wrapper">`);
        noo.wrapperInput = doCreate.element(`<input
          id="${optId}-control"
          name="${optId}-control-name"
          type="text"
          class="dds__date-picker__input"
          placeholder="${optPlaceholder}"
          ${optRequired ? `required=""` : ``}
          aria-labelledby="${optId}-label ${optId}-helper"
          ${optDataAttributes}
        />`);
        noo.wrapperSmall = doCreate.element(`<small id="${optId}-helper" class="dds__date-picker__helper">${optHelper}</small>`);
        noo.wrapperError = doCreate.element(`<div id="${optId}-error" class="dds__date-picker__invalid-feedback">${optError}</div>`);

        noo.comp.appendChild(noo.label);
        noo.comp.appendChild(noo.wrapper);
        noo.wrapper.appendChild(noo.wrapperInput);
        noo.wrapper.appendChild(noo.wrapperSmall);
        noo.wrapper.appendChild(noo.wrapperError);

        return noo.comp;
    },
    drawer: (options = {}) => {
        if (!options.labels) {
            options.labels = {};
        }

        const noo = {};
        const optId = options.id || doCreate.id(`drawer`);
        const optClass = options.class || ``;
        const optLabel = options.labels.trigger || `Show Drawer`;
        const optTrigger = doCreate.utils.getTarget(options.trigger);
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
            noo.trigger = doCreate.button({
                id: `${optId}-trigger`,
                label: optLabel,
                class: `dds__button--primary`,
            });
            optParent.appendChild(noo.trigger);
        }
        noo.comp = doCreate.element(`<div class="dds__drawer ${optClass}" aria-hidden="true" data-dds="drawer" id="${optId}" data-trigger="#${noo.trigger.id}" tabindex="-1">`);
        noo.overlay = doCreate.element(`<div class="dds__drawer__overlay" aria-hidden="true">`);
        noo.container = doCreate.element(`<div class="dds__drawer__container">`);
        noo.containerHead = doCreate.element(`<div class="dds__drawer__header">`);
        noo.containerHeadButton = doCreate.element(`<button type="button" class="dds__drawer__close">${optBack}</button>`);
        noo.containerBody = doCreate.element(`<div class="dds__drawer__body">`);
        noo.containerBodyTitle = doCreate.element(`<h3 class="dds__drawer__title">${optTitle}</h3>`);
        noo.containerBodySubtitle = doCreate.element(`<h5>${optSubtitle}</h5>`);
        noo.containerBodyContents = doCreate.element(`<span class="ddsc__drawer__body__contents">`);
        noo.containerFooter = doCreate.element(`<div class="dds__drawer__footer">`);

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
        noo.containerFooter.clearChildren = () => { doCreate.utils.clearChildren(noo.containerFooter); };
        noo.containerBodyContents.clearChildren = () => { doCreate.utils.clearChildren(noo.containerBodyContents); };

        doCreate.utils.addApi({
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
    },
    dropdown: (options = {}) => {
        const noo = {};
        const optId = options.id || doCreate.id(`dropdown`);
        const optClass = options.class || ``;
        const optSelection = options.selection ? `data-selection="${options.selection}"` : ``;
        const optLabel = options.label || ``;
        const optHelper = options.helper || ``;
        const optError = options.error || ``;
        const optSelectAllLabel = options.selectAllLabel || `Select All`;
        const optAutocomplete = options.autocomplete ? 'on' : `off`;
        const optItems = options.items || [];
        const optDisabled = options.disabled || false;
        const optRequired = options.required || false;
        const optPlaceholder = options.placeholder || ``;
        const optMaxLength = options.maxlength != null ? `maxlength="${options.maxlength}"` : ``;
        const optChange = options.onchange || options.onChange || options.change || undefined;
        
        noo.comp = doCreate.element(`<div id="${optId}"
            class="dds__dropdown ${optClass}"
            data-dds="dropdown"
            ${optSelection}
            data-select-all-label="${optSelectAllLabel}"
            ${optRequired ? `data-required="true"`: ``}
        >`);
        noo.container = doCreate.element(`<div class="dds__dropdown__input-container">`);
        noo.label = doCreate.element(`<label id="${optId}-label" for="${optId}-input" ${optRequired ? `class="dds__label--required"` : ``}>${optLabel}</label>`);
        noo.wrapper = doCreate.element(`<div 
            class="dds__dropdown__input-wrapper"
            role="combobox"
            aria-haspopup="listbox"
            aria-controls="${optId}-popup"
            aria-expanded="false"
        >`);
        noo.input = doCreate.element(`<input 
            id="${optId}-input"
            name="${optId}-input-name"
            type="text"
            class="dds__dropdown__input-field"
            autocomplete: "${optAutocomplete}"
            aria-labelledby="${optId}-label ${optId}-helper",
            aria-expanded="false"
            aria-controls="${optId}-list"
            ${optPlaceholder ? `placeholder="${optPlaceholder}"`: ``}
            ${optDisabled ? `disabled="true"` : ``}
            ${optMaxLength}
        >`);
        noo.feedback = doCreate.element(`<em class="dds__icon dds__icon--alert-notice dds__dropdown__feedback__icon" aria-hidden="true">`);
        noo.helper = doCreate.element(`<small 
            id="${optId}-helper"
            class="dds__input-text__helper ${optHelper === `` ? `dds__d-none` : ``}"
        >${optHelper}</small>`);
        noo.error = doCreate.element(`<div 
            id="${optId}-error"
            class="dds__invalid-feedback ${!optError ? `dds__d-none` : ``}"
        >${optError}</div>`);
        noo.popup = doCreate.element(`<div 
            id="${optId}-popup"
            class="dds__dropdown__popup dds__dropdown__popup--hidden"
            role="presentation"
            tabindex="-1"
        >`);
        noo.list = doCreate.element(`<ul id="${optId}-list" tabindex="-1" role="listbox" class="dds__dropdown__list">`);

        noo.comp.appendChild(noo.container);
        noo.container.appendChild(noo.label);
        noo.comp.appendChild(noo.wrapper);
        noo.wrapper.appendChild(noo.input);
        noo.wrapper.appendChild(noo.feedback);
        noo.wrapper.appendChild(noo.helper);
        noo.wrapper.appendChild(noo.error);
        noo.comp.appendChild(noo.popup);
        noo.popup.appendChild(noo.list);

        noo.comp.appendChild = (childEl) => {
            noo.comp.querySelector(`.dds__dropdown__list`).appendChild(childEl);
        };

        optItems.forEach(oItem => {
            const newDropItem = doCreate.dropdownItem(oItem);
            noo.comp.appendChild(newDropItem);
        });
        if (optChange) {
            doCreate.listener(`#${optId}`, `ddsDropdownSelectionChangeEvent`, optChange);
        }
        return noo.comp;
    },
    dropdownItem: (options = {}) => {
        if (typeof options === `string`) {
            options = {
                label: options,
            };
        }
        const noo = {};
        const optLabel = options.label || `Item Label`;
        const optClick = options.onclick || options.onClick || options.click || undefined;
        let optDataValue = options[`data-value`] != null ? options[`data-value`]
        : options[`value`] != null ? options[`value`]
        : undefined;
        const optId = options.id || doCreate.id(optLabel.replace(/[^0-9a-zA-Z]+/, ``));
        const optSelected = options.selected != null ? options.selected : options.checked != null ? options.checked : false;
        const optDataAttributes = doCreate.utils.getDataAttributes(options);

        if (optDataValue != null) {
            optDataValue = `data-value="${optDataValue}"`;
        } else {
            optDataValue = ``;
        }

        noo.item = doCreate.element(`<li class="dds__dropdown__item" role="option">`);
        noo.itemButton = doCreate.element(`<button
            id="${optId}"
            type="button"
            class="dds__dropdown__item-option"
            role="option"
            tabindex="-1"
            data-selected="${optSelected}"
            aria-checked="${optSelected}"
            ${optDataValue}
            ${optDataAttributes}
        >`);
        noo.itemText = doCreate.element(`<span class="dds__dropdown__item-label">${optLabel}</span>`);

        noo.item.appendChild(noo.itemButton);
        noo.itemButton.appendChild(noo.itemText);
        if (optClick) {
            doCreate.listener(`#${optId}`, `click`, optClick);
        }
        return noo.item;
    },
    element: (blueprint, isSvg = false) => {
        const definiteSvgTypes = [
            "animate", 
            "animateMotion", 
            "animateTransform", 
            "circle", 
            "clipPath", 
            "defs", 
            "desc", 
            "discard", 
            "ellipse", 
            "feBlend", 
            "feColorMatrix", 
            "feComponentTransfer", 
            "feComposite", 
            "feConvolveMatrix", 
            "feDiffuseLighting", 
            "feDisplacementMap", 
            "feDistantLight", 
            "feDropShadow", 
            "feFlood", 
            "feFuncA", 
            "feFuncB", 
            "feFuncG", 
            "feFuncR", 
            "feGaussianBlur", 
            "feImage", 
            "feMerge", 
            "feMergeNode", 
            "feMorphology", 
            "feOffset", 
            "fePointLight", 
            "feSpecularLighting", 
            "feSpotLight", 
            "feTile", 
            "feTurbulence", 
            "filter", 
            "foreignObject", 
            "g", 
            "hatch", 
            "hatchpath", 
            "image", 
            "line", 
            "linearGradient", 
            "marker", 
            "mask", 
            "metadata", 
            "mpath", 
            "path", 
            "pattern", 
            "polygon", 
            "polyline", 
            "radialGradient", 
            "rect", 
            "set", 
            "stop", 
            "svg", 
            "switch", 
            "symbol", 
            "text", 
            "textPath", 
            "tspan", 
            "use", 
            "view", 
        ]
        if (typeof isSvg === `string`) {
            isSvg = isSvg === `svg` || isSvg === `true`;
        }
        const props = [];
        const propNames = [];
        const svgNs = `http://www.w3.org/2000/svg`;
        const blueprintOpener = blueprint.substring(0, blueprint.indexOf(`>`)).trim();
        const blueprintSpaceOrClose = blueprint.match(/( |>)/g);
        let regex;
        let domType;
        let parameters = blueprintOpener.match(/ [^ "]*"/g);
        try {
            let typeLength = blueprintOpener.indexOf(blueprintSpaceOrClose[0]) > 0
            ? blueprintOpener.indexOf(blueprintSpaceOrClose[0])
            : blueprintOpener.length;
            domType = blueprintOpener.substr(0, typeLength).replace(`<`, ``).trim();
            parameters = blueprintOpener.match(/( |\n)[^ "]*="/g);
        } catch (e) {
            console.error(`DO: Blueprint error: ${blueprint}`, e);
        }
        if (definiteSvgTypes.includes(domType)) {
            isSvg = true;
        }
        if (parameters) {
            parameters.forEach(param => {
                if (param.indexOf(`=`) > -1) {
                    param = param.replace(`='"'`, ``);
                    param = param.replace(`="`, ``);
                    param = param.trim();
                    propNames.push(param);
                }
            });
        }
        propNames.forEach(pName => {
            regex = new RegExp(`(${pName}=")[^"]*(")`);
            const pValue = blueprint.match(regex)[0].replace(`${pName}="`, ``).replace(`"`, ``);
            props[pName] = pValue;
        });
        regex = new RegExp(`(<${domType})[^>]*(>)`);
        const opening = blueprint.match(regex)[0];
        const closing = `</${domType}>`;
        const contents = blueprint.replace(opening, ``).replace(closing, ``);
        if (contents.indexOf(`<`) > -1) {
            props.html = contents;
        } else {
            props.text = contents;
        }
        let domNode;
        if (isSvg) {
            domNode = document.createElementNS(svgNs, domType)
        } else {
            domNode = document.createElement(domType);
        }
        for (const prop in props) {
            if (prop === "html") {
                domNode.innerHTML = props[prop];
            } else if (prop === "text") {
                domNode.textContent = props[prop];
            } else {
                if (prop.slice(0, 5) === "aria_" || prop.slice(0, 4) === "data_") {
                    const attr = prop.slice(0, 4) + "-" + prop.slice(5);
                    domNode.setAttribute(attr, props[prop]);
                } else {
                    domNode.setAttribute(prop, props[prop]);
                }
            }
            // Set attributes on the element if passed
            if (["role", "aria-label"].includes(prop)) domNode.setAttribute(prop, props[prop]);
        }
        return domNode;
    },
    fieldset: (options = {}) => {
        const noo = {};
        const optId = options.id || doCreate.id(`fieldset`);
        const optClass = options.class || ``;

        noo.comp = doCreate.element(`<fieldset id="${optId}" class="dds__form__section ${optClass}">`);

        return noo.comp;
    },
    fileInput: (options = {}) => {
        if (!options.labels) {
            options.labels = {};
        }
        const noo = {};
        const optId = options.id || doCreate.id(`fileInput`);
        const optClass = options.class || ``;        
        const optHelper = options.helper || ``;
        const optAccept = options.accept || `.png, .pdf, video/*`;
        const optMultiple = options.multiple || false;
        const optRequired = options.required || false;
        const optTitle = options.labels.title || `Upload`;
        const optBrowse = options.labels.browse || `Browse files`;
        const optError = options.labels.error || `Error`;
        const optDataAttributes = doCreate.utils.getDataAttributes(options);

        noo.comp = doCreate.element(`<div id="${optId}" class="dds__file-input ${optClass}" data-dds="file-input" role="group" aria-labelledby="${optId}-label">`);
        noo.label = doCreate.element(`<label id="${optId}-label" for="${optId}-control" class="dds__label ${optRequired ? `dds__label--required` : ``}">${optTitle}</label>`);
        noo.helper = doCreate.element(`<small id="${optId}-helper" class="dds__file-input__helper-text">${optHelper}</small>`);
        noo.control = doCreate.element(`  <input
            aria-hidden="true"
            id="${optId}-control"
            name="${optId}-control-name"
            type="file"
            class="dds__file-input__control"
            accept="${optAccept}"
            ${optMultiple ? `multiple=""`: ``}
            ${optRequired ? `required=""`: ``}
            ${optDataAttributes}
        />`);
        noo.button = doCreate.button({
            class: `dds__button--secondary dds__button--md dds__file-input__button`,
            ariaDescribedBy: `${optId}-helper`,
        });
        // noo.buttonSvg = doCreate.element(`<svg class="dds__icon dds__button__icon--start" focusable="false"><use xlink:href="#dds__icon--upload"></use></svg>`);
        noo.buttonSvg = doCreate.icon({
            icon: `upload`,
            class: `dds__button__icon--start`,
        });
        noo.buttonContent = doCreate.element(`<span id="${optId}-button-content">${optBrowse}</span>`);
        noo.error = doCreate.element(`<div id="${optId}-error" aria-live="polite" class="dds__error-text">${optError}</div>`);
        noo.errorIcon = doCreate.element(`<span class="dds__icon dds__icon--alert-notice dds__error-text__icon" aria-hidden="true"></span>`);

        noo.button.appendChild(noo.buttonSvg);
        noo.button.appendChild(noo.buttonContent);
        noo.error.prepend(noo.errorIcon);
        noo.comp.appendChild(noo.label);
        noo.comp.appendChild(noo.helper);
        noo.comp.appendChild(noo.control);
        noo.comp.appendChild(noo.button);
        noo.comp.appendChild(noo.error);

        return noo.comp;
    },
    footnote: (options = {}) => {
        const noo = {};
        const optId = options.id || doCreate.id(`footnote`);
        let optNumber = options.number;
        if (!optNumber) {
            doCreate.footnotesCreated++;
            optNumber = doCreate.footnotesCreated;
        }
        const optClass = options.class || ``;
        const optNote = options.note || ``;
        const optTitle = options.title || `Jump back to the related footnote in the text.`;
        const optAriaLabel = options.ariaLabel || `Back to reference`;
        const optSrOnly = options.srOnly || `Footnotes`;
        let optRoot = doCreate.utils.getTarget(options.target) || document.querySelector(`.dds__footnote`);

        noo.sup = doCreate.element(`<sup id="${optId}">`);
        noo.supA = doCreate.element(`<a href="#${optId}-note" id="${optId}-anchor" aria-describedby="${optId}-label">[${optNumber}]</a>`);
        noo.li = doCreate.element(`<li id="${optId}-note">${optNote}</li>`);
        noo.liA = doCreate.element(`<a href="#${optId}" title="${optTitle}" aria-label="${optAriaLabel}">[ ? ]</a>`);

        if (!optRoot || !optRoot.classList.contains(`dds__footnote`)) {
            optRoot = doCreate.element(`<footer class="dds__footnote">`);
            document.querySelector(`body`).appendChild(optRoot);
        }
        if (!optRoot.querySelector(`.dds__sr-only`)) {
            optRoot.appendChild(doCreate.element(`<h2 id="${optId}-label" class="dds__sr-only">${optSrOnly}</h2>`));
        }
        if (!optRoot.querySelector(`ol`)) {
            optRoot.appendChild(doCreate.element(`<ol>`))
        }

        optRoot.querySelector(`ol`).appendChild(noo.li);
        noo.li.appendChild(noo.liA);

        noo.sup.appendChild(noo.supA);
        return noo.sup;
    },
    footnotesCreated: 0,
    form: (options = {}) => {
        const noo = {};
        const optId = options.id || doCreate.id(`form`);
        const optClass = options.class || ``;

        noo.comp = doCreate.element(`<form id="${optId}" data-dds="form" class="dds__form ${optClass}">`);

        return noo.comp;
    },
    icon: (options = {}) => {
        const noo = {};
        const optId = options.id || doCreate.id(`icon`);
        const optClass = options.class || ``;
        const optType = options.type || `svg`;
        let optIcon = options.icon || `dds__icon--accessibility`;
        if (optIcon.indexOf(`dds__icon--`) < 0) {
            optIcon = `dds__icon--${optIcon}`;
        }

        if (!document.getElementById(optIcon)) {
            doCreate.iconDef({
                icon: optIcon
            });
        }
        if (optType === `svg`) {
            noo.icon = doCreate.element(`<svg id="${optId}" class="dds__icon ${optClass}" focusable="false"><use xlink:href="#${optIcon}"></use></svg>`);
        } else {
            noo.icon = doCreate.element(`<${optType} id="${optId}" class="dds__icon ${optClass} ${optIcon}">`);
        }

        return noo.icon;
    },
    iconDef: (options = {}) => {
        if (!options.icon) {
            console.error(`Cannot create icon definition without options.icon`);
            return;
        }
        const newSvgDef = (newDef) => {
            const newSvg = doCreate.element(`<svg id="doCreate__icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="position: absolute; width: 0; height: 0; overflow: hidden;" aria-hidden="true">`);
            const newStyle = doCreate.element(`<style type="text/css">
                @keyframes loading-sqr { 0%,100% { opacity: .1; } 25% { opacity: .5; } 45%,75% { opacity: 1; } 95% { opacity: .5; } }
                @keyframes loading-sqrs { 0%,100% { opacity: .1; } 45% { opacity: .8; } 50% { opacity: 1; } 55% { opacity: .25; } }
            </style>`, `svg`);
            const newDefs = doCreate.element(`<defs>`);
            newSvg.appendChild(newStyle);
            newSvg.appendChild(newDefs);
            if (newDef) {
                newDefs.appendChild(newDef);
            }
            return newSvg;
        };
        let optIcon = options.icon || `dds__icon--accessibility`;
        if (optIcon.indexOf(`dds__icon--`) < 0) {
            optIcon = `dds__icon--${optIcon}`;
        }
        let svgEl = document.getElementById(`doCreate__icons`);
        if (document.getElementById(optIcon)) {
            if (options.callback) {
                options.callback(svgEl.outerHTML);
            }
            return;
        }
        let svgStyle;
        let svgDefs;
        if (!svgEl) {
            svgEl = newSvgDef();
            document.querySelector(`head`).appendChild(svgEl);
        }
        if (!svgDefs) {
            svgDefs = svgEl.querySelector(`defs`);
        }
        let iconSymbol;
        doXhr.fetch(`https://dds.dell.com/icons/2.8.1/dds-icons-defs.svg`).then((res) => {
            const newEl = document.createElement("div");
            newEl.innerHTML = res;
            const outerH = newEl.querySelector(`#${optIcon}`);
            if (!outerH) {
                if (options.callback) {
                    options.callback(null);
                }
                return null;
            }
            iconSymbol = doCreate.element(outerH.outerHTML);
            svgDefs.appendChild(iconSymbol);
            if (options.callback) {
                options.callback({
                    all: svgEl.outerHTML,
                    new: newSvgDef(iconSymbol).outerHTML,
                });
            }
        })
    },
    iconName: (iName) => {
        if (iName) 
            return iName ? `dds__icon--${iName.replace('dds__icon--', '')}` : ``;
    },
    inputMask: (options) => {
        return doCreate.textInput({
            ...options,
            type: `tel`,
        });
    },
    inputPassword: (options) => {
        return doCreate.textInput({
            ...options,
            type: `password`,
        });
    },
    id: (custom) => {
        let customId = custom;
        if (customId) {
            customId = customId.replace(/[^\w\s]/gi, '');
            customId = customId.replace(/ /g, ``);
        }
        return `${custom ? customId : null || ["a", "b", "c", "d", "e"][doCreate.random(0, 5)]}-${doCreate.random()}`;
    },
    link: (options = {}) => {
        const noo = {};
        const optId = options.id || doCreate.id(`link`);
        const optLabel = options.label || ``;
        const optHref = options.href || `javascript:void(0);`;
        const optClass = options.class || ``;
        const optIcon = options.icon;

        noo.comp = doCreate.element(`<a id="${optId}" class="${optClass}" href="${optHref}">${optLabel}</a>`);

        if (optIcon) {
            noo.icon = doCreate.icon({
                icon: doCreate.iconName(optIcon),
            });
            noo.comp.appendChild(noo.icon);
        }

        noo.comp.element = noo.comp;
        return noo.comp;
    },
    list: (options = {}) => {
        const noo = {};
        const optId = options.id || doCreate.id(`list`);
        const optLabel = options.label || ``;
        const optClass = options.class || ``;
        const optItems = options.items || [];

        noo.comp = doCreate.element(`<ul id="${optId}" class="dds__list ${optClass}">`);
        optItems.forEach(oItem => {
            const itemId = oItem.id || `${optId}-item`;
            const itemRole = oItem.role || `listitem`;
            const itemClass = oItem.class || ``;
            const itemText = oItem.text || ``;
            const itemDataAttributes = doCreate.utils.getDataAttributes(oItem);
            noo.comp.appendChild(doCreate.element(`<li id="${itemId}" role="${itemRole}" class="${itemClass}" ${itemDataAttributes}>${itemText}`));
        })

        // not adding this; it was going to be for DDSC.SortableList, a custom component
        // const optChange = options.onchange || options.onChange || options.change || undefined;
        // if (optChange) {
        //     doCreate.listener(`#${optId}`, `ddsListUpdatedEvent`, optChange);
        // }

        noo.comp.element = noo.comp;
        return noo.comp;
    },
    listener: function (selector, event, handler) {
        // rootElement is where we're going to attach this listener
        // you can't add it to the selector because that selector might not exist yet
        let rootElement = document.querySelector('body');

        // generate a unique ID for this event and check if it's already stored
        const listenerId = `${selector}__${event}`;
        const listenerExists = doCreate.utils.listeners.includes(listenerId);

        // define the handler for this listener
        const listenerInstance = function (evt) {
            // targetElement starts where the user clicks
            var targetElement = evt.target;
            // walk up from the click target until there is no parent left
            // if the target is found, fire the handler
            while (targetElement != null) {
                if (targetElement.matches(selector)) {
                    handler(evt);
                    return;
                }
                targetElement = targetElement.parentElement;
            }
        };
        if (!listenerExists) {
            doCreate.utils.listeners.push(listenerId);
            rootElement.addEventListener(event, listenerInstance, true);
        }
    },
    loadingIndicator: (options = {}) => {
        if (options.parent === document.querySelector(`body`)) {
            delete options.parent;
        }

        const noo = {};
        const optId = options.id || doCreate.id(`loadingIndicator`);
        const optClass = options.class || `dds__loading-indicator--lg dds__loading-indicator__overlay--blur`;
        const optParent = typeof options.parent === `string` ? document.querySelector(options.parent) : options.parent;
        const optSrOnly = options.srOnly || ``;
        const optLabel = options.label || ``;

        if (optParent) {
            doCreate.style(`.ddsc__loading-indicator-centered {
                pointer-events: none;
                position: absolute;
            }`);
            doCreate.style(`.ddsc__loading-indicator-button {
                pointer-events: none;
                position: absolute;
                height: initial !important;
            }`);
            doCreate.style(`.ddsc__loading-indicator  .dds__loading-indicator {
                width: 100%;
            }`);
            if (optParent.nodeName === `BUTTON`)  {
                noo.comp = doCreate.element(`<div id="${optId}" class="dds__loading-indicator dds__loading-indicator--md ddsc__loading-indicator-button dds__d-none">`);
                noo.compLabel = doCreate.element(`<div class="dds__sr-only">${optLabel}</div>`);
                noo.compSpinner = doCreate.element(`<div class="dds__loading-indicator__spinner"></div>`)

                noo.comp.appendChild(noo.compLabel);
                noo.comp.appendChild(noo.compSpinner);

                optParent.disable = () => {
                    noo.comp.classList.remove(`dds__d-none`);
                    optParent.disabled = true;
                };
                optParent.enable = () => {
                    noo.comp.classList.add(`dds__d-none`);
                    optParent.disabled = false;
                };
            } else {
                noo.comp = doCreate.element(`<div id="${optId}" class="ddsc__loading-indicator">`);
                noo.compLoading = doCreate.element(`<div class="dds__loading-indicator ${optClass} ddsc__loading-indicator-centered">`)
                noo.compLoadingOverlay = doCreate.element(`<div class="dds__overlay dds__overlay--absolute">`);
                noo.compLoadingSr = doCreate.element(`<div class="dds__sr-only">${optSrOnly}</div>`);
                noo.compLoadingSpinner = doCreate.element(`<div class="dds__loading-indicator__spinner"></div>`);

                noo.comp.appendChild(noo.compLoading);
                noo.compLoading.appendChild(noo.compLoadingOverlay);
                noo.compLoading.appendChild(noo.compLoadingSr);
                noo.compLoading.appendChild(noo.compLoadingSpinner);

                doCreate.utils.addApi({
                    target: noo.comp,
                    isInternal: options.isInternal,
                    api: {
                        show: (e) => {
                            optParent.querySelector(`.dds__loading-indicator`).classList.remove(`dds__d-none`);
                            optParent.disabled = true;
                        },
                        hide: (e) => {
                            optParent.querySelector(`.dds__loading-indicator`).classList.add(`dds__d-none`);
                            optParent.disabled = false;
                        }
                    },
                });

            }

            optParent.prepend(noo.comp);
        } else {
            noo.comp = doCreate.element(`<div id="${optId}" class="dds__loading-indicator__container ${optClass}" data-dds="loading-indicator">`);
            noo.compOverlay = doCreate.element(`<div class="dds__loading-indicator__overlay" aria-hidden="true"></div>`);
            noo.compWrapper = doCreate.element(`<div class="dds__loading-indicator__wrapper">`);
            noo.compWrapperLoader = doCreate.element(`<div class="dds__loading-indicator">`);
            noo.compWrapperLoaderLabel = doCreate.element(`<div class="dds__loading-indicator__label" aria-live="polite">${optLabel}</div>`);
            noo.compWrapperLoaderSpinner = doCreate.element(`<div class="dds__loading-indicator__spinner"></div>`);

            noo.comp.appendChild(noo.compOverlay);
            noo.comp.appendChild(noo.compWrapper);
            noo.compWrapper.appendChild(noo.compWrapperLoader);
            noo.compWrapperLoader.appendChild(noo.compWrapperLoaderLabel);
            noo.compWrapperLoader.appendChild(noo.compWrapperLoaderSpinner);
        }
        return noo.comp;
    },
    messageBar: (options = {}) => {
        const noo = {};
        const optId = options.id || doCreate.id(`messageBar`);
        const optClass = options.class || ``;
        const optIcon = options.icon ? `dds__icon--${options.icon.replace('dds__icon--', '')}` : `dds__icon--alert-info-cir`;
        const optTitle = options.title || ``;
        const optBody = options.body || ``;
        const optGlobal = options.global || false;


        noo.comp = doCreate.element(`<div
            id="${optId}"
            data-dds="message-bar"
            role="dialog"
            aria-describedby="${optId}-content"
            aria-labelledby="${optId}-title"
            class="dds__message-bar ${optClass}"
        >`);
        noo.compIcon = doCreate.element(`<span class="dds__icon ${optIcon} dds__message-bar__icon" aria-hidden="true"></span>`);
        noo.compContent = doCreate.element(`<div id="${optId}-content" class="dds__message-bar__content">${optBody}</div>`);
        noo.compContentTitle = doCreate.element(`<b id="${optId}-title">${optTitle}</b>`)

        noo.comp.appendChild(noo.compIcon);
        noo.comp.appendChild(noo.compContent);
        noo.compContent.prepend(noo.compContentTitle);

        if (optGlobal) {
            noo.global = doCreate.element(`<div class="dds__message-bar--global__container">`);
            noo.global.appendChild(noo.comp);
        }


        return noo.global || noo.comp;
    },
    modal: (options = {}) => {
        if (!options.labels) {
            options.labels = {};
        }

        const noo = {};
        const optId = options.id || doCreate.id(`modal`);
        const optClass = options.class || ``;
        const optLabel = options.labels.trigger || options.label || `Show Modal`;
        const optTitle = options.labels.title || options.title || ``;
        const optTrigger = doCreate.utils.getTarget(options.trigger);
        const optParent = options.parent || document.querySelector(`body`);
        const optBody = typeof options.body === `string` ? doCreate.element(`<span>${options.body}`) : options.body;
        const optFooter = options.footer;
        const optClick = options.onclick || options.onClick || options.click || undefined;

        if (optTrigger) {
            noo.trigger = optTrigger;
        } else {
            noo.trigger = doCreate.button({
                label: optLabel,
                id: `${optId}-trigger`,
            });
            optParent.appendChild(noo.trigger);
        }

        noo.comp = doCreate.element(`<div id="${optId}" role="dialog" data-dds="modal" class="dds__modal ${optClass}" data-trigger="#${noo.trigger.id}" aria-labelledby="${optId}-headline">`);
        noo.content = doCreate.element(`<div class="dds__modal__content">`);
        noo.contentTitle = doCreate.element(`<div class="dds__modal__header"><h3 class="dds__modal__title" id="${optId}-headline">${optTitle}</h3></div>`);
        noo.contentBody = doCreate.element(`<div id="${optId}-body" class="dds__modal__body">`);
        noo.contentFooter = doCreate.element(`<div class="dds__modal__footer">`);

        noo.comp.appendChild(noo.content);
        noo.content.appendChild(noo.contentTitle);
        noo.content.appendChild(noo.contentBody);
        noo.content.appendChild(noo.contentFooter);

        if (optBody) {
            noo.contentBody.appendChild(optBody);
        }
        if (optFooter) {
            noo.contentFooter.appendChild(optFooter);
        }
        if (optClick) {
            noo.comp.addEventListener(`ddsModalOpenedEvent`, optClick);
        }

        doCreate.utils.addApi({
            target: noo.comp,
            isInternal: options.isInternal,
            api: {
                appendChild: (e) => {
                    if (!e) {
                        return;
                    }
                    if (typeof e === `string`) {
                        e = doCreate.element(`<span>${e}`);
                    }
                    noo.contentBody.appendChild(e);
                },
                body: (e) => {
                    if (e) {
                        if (typeof e === `string`) {
                            e = doCreate.element(`<span>${e}`);
                        }
                        noo.contentBody.innerText = ``;
                        noo.contentBody.appendChild(e);
                    } else {
                        return noo.contentBody.innerHTML;
                    }
                }
            },
        });

        return noo.comp;
    },
    moreLess: (options = {}) => {
        const types = {
            related: `related`,
            list: `list`,
            bottom: `bottom`,
            inline: `inline`,
        };
        const noo = {};
        const optId = options.id || doCreate.id(`tag`);
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

        noo.comp = doCreate.element(`<span id="${optId}" class="${typeClass}" data-dds="more-less">`);
        noo.button = doCreate.element(`<button class="${optClass}" type="button" aria-expanded="false">`);
        noo.buttonMore = doCreate.element(`<span class="dds__more-less__button--more">${optLabel}</span>`);
        noo.buttonLess = doCreate.element(`<span class="dds__more-less__button--less">${optLabelLess}</span>`);
        noo.target = typeof optTarget === `string` ? doCreate.element(`<span class="dds__more-less__target">${optTarget}`) : optTarget;
        noo.ellipsis = doCreate.element(`<span class="dds__more-less__ellipsis">...</span>`);
        if (optIntro) {
            noo.intro = typeof optIntro === `string` ? doCreate.element(`<span>${optIntro}</span>`) : optIntro;
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
    },
    notification: (options = {}) => {
        const noo = {};
        const optId = options.id || doCreate.id(`notification`);
        const optClasses = options.class ? options.class.split(` `) : [];
        const optTimeStamp = options.timeStamp === `now` ? (() => {const d = new Date(); return `${d.getHours()}:${`0${d.getMinutes()}`.slice(-2)}`;})() : options.timeStamp || ``;
        const optBody = options.messageBody || options.body || `Notification`;
        const optTitle = options.title || ``;
        const optClose = (options.close == null && options.closeIcon == null) ? true : options.close || options.closeIcon || false; 
        const optPrimaryActionText= options.primaryActionText || ``;
        const optSecondaryActionText= options.secondaryActionText || ``;
        const optPrimaryAction = options.primaryAction;
        const optSecondaryAction = options.secondaryAction;
        const optIcon = options.icon ? `dds__icon--${options.icon.replace('dds__icon--', '')}` : `dds__icon--alert-info-cir`;
        const optIconType = options.iconType || `svg`;
        const optOpen = options.open != null ? options.open : false;

        if (optIconType === `svg`) {
            doCreate.iconDef({
                icon: optIcon,
            });
        }

        const data = {
            closeIcon: optClose,
            title: optTitle,
            messageBody: optBody.querySelector == null ? optBody : `<span></span>`,
            timeStamp: optTimeStamp,
            primaryActionText: optPrimaryActionText,
            secondaryActionText: optSecondaryActionText,
            titleIcon: optIcon,
            titleIconType: optIconType
        };
        if (optPrimaryAction) {
            data.primaryAction = optPrimaryAction;
        }
        if (optSecondaryAction) {
            data.secondaryAction = optSecondaryAction;
        }
        let notification;

        noo.comp = doCreate.element(`<span id="${optId}-trigger">`);
        noo.comp.show = () => {
            if (!notification) {
                notification = new DDS.Notification(data);
                setTimeout(() => {
                    if (optBody.querySelector != null) {
                        notification.element.querySelector(`.dds__notification__message`).appendChild(optBody);
                    }
                    if (notification.element) {
                        notification.element.id = optId;
                    }
                    optClasses.forEach(oClass => {
                        if (notification.element) {
                            notification.element.classList.add(oClass);
                        }
                    });
                })
            }
        };
        noo.comp.hide = () => {
            if (notification) {
                try {
                    notification.hide();
                } catch (e) {}
                if (notification.element) {
                    notification.element.remove();
                }
                noo.comp.remove();
                notification = undefined;
            }
        }

        if (optOpen) {
            noo.comp.show();
        }

        return noo.comp;
    },
    pagination: (options = {}) => {
        if (!options.labels) {
            options.labels = {};
        }
        const noo = {};
        const optId = options.id || doCreate.id(`pagination`);
        const optClass = options.class || ``;
        const optAriaLabel = options.labels.aria || `Pagination`;
        const optPerPageLabel = options.labels.perPage || `Items per page`;
        const optPerPageValues = options.perPageValues || [10, 20, 30];
        const optOf = options.labels.of || ` of `;
        const optItems = options.labels.items || ` items `;
        const optAriaFirstPage = options.labels.ariaFirstPage || `First page`;
        const optAriaPreviousPage = options.labels.ariaPreviousPage || `Previous`;
        const optAriaNextPage = options.labels.ariaNextPage || `Next`;
        const optAriaLastPage = options.labels.ariaLastPage || `Last page`;
        const optCurrentPage = options.currentPage || 1;
        const optRowsPerPage = options.rowsPerPage || optPerPageValues[0];
        const optTotalItems = options.totalItems;


        noo.comp = doCreate.element(`<div class="dds__pagination ${optClass}" data-dds="pagination" id="${optId}" role="navigation" aria-label="${optAriaLabel}" ${optTotalItems != null ? `data-total-items="${optTotalItems}"` : ``}>`);
        noo.summ = doCreate.element(`<div class="dds__pagination__summary">`);
        noo.summPpLabel = doCreate.element(`<label class="dds__pagination__per-page-label" for="${optId}-per-page_control">${optPerPageLabel}</label>`);
        noo.summSelect = doCreate.select({
            id: `${optId}-per-page`,
            class: `dds__select--sm dds__pagination__per-page-select`,
            values: optPerPageValues,
            selected: optRowsPerPage,
        });
        noo.summRange = doCreate.element(`<div class="dds__pagination__range" aria-live="polite">–</div>`);
        noo.summRangeStart = doCreate.element(`<span class="dds__pagination__range-start"></span>`);
        noo.summRangeEnd = doCreate.element(`<span class="dds__pagination__range-end"></span>`);
        noo.summRangeLabel = doCreate.element(`<span class="dds__pagination__range-total-label">${optOf}</span>`);
        noo.summRangeLabelTotal = doCreate.element(`<span class="dds__pagination__range-total"></span>`);

        noo.summRange.prepend(noo.summRangeStart);
        noo.summRange.appendChild(noo.summRangeEnd);
        noo.summRange.appendChild(noo.summRangeLabel);
        noo.summRangeLabel.appendChild(noo.summRangeLabelTotal);
        noo.summRangeLabel.innerHTML += optItems;

        noo.summNav = doCreate.element(`<div class="dds__pagination__nav">`);
        noo.summNavButtonFirst = doCreate.button({
            id: `${optId}-buttonFirst`,
            class: `dds__button--tertiary dds__button--sm dds__button__icon dds__pagination__first-page`,
            ariaLabel: `${optAriaFirstPage}`,
        });
        noo.summNavButtonPrev = doCreate.button({
            id: `${optId}-buttonPrevious`,
            class: `dds__button--tertiary dds__button--sm dds__pagination__prev-page`,
        });

        noo.summNavButtonPrev.appendChild(doCreate.element(`<span class="dds__pagination__prev-page-label">${optAriaPreviousPage}</span>`));

        noo.summNavPR = doCreate.element(`<div class="dds__pagination__page-range">`)
        noo.summNavPRLabel = doCreate.element(`<label class="dds__pagination__page-range-label" for="${optId}_pageRange">Page</label>`);
        noo.summNavPRCont = doCreate.element(`<div class="dds__input-text__container dds__input-text__container--sm">`);
        noo.summNavPRContWrap = doCreate.element(`<div class="dds__input-text__wrapper dds__pagination__page-range-current-wrapper">`);
        noo.summNavPRContWrapInput = doCreate.element(`<input class="dds__input-text dds__pagination__page-range-current" type="text" id="${optId}_pageRange">`);
        noo.summNavPrTotal = doCreate.element(`
          <div class="dds__pagination__page-range-total-label">
            ${optOf}
            <span class="dds__pagination__page-range-total"></span>
          </div>`);
        noo.summNavButtonNext = doCreate.button({
            id: `${optId}-buttonNext`,
            class: `dds__button--tertiary dds__button--sm dds__pagination__next-page`,
        });
        noo.summNavButtonNext.appendChild(doCreate.element(`<span class="dds__pagination__next-page-label">${optAriaNextPage}</span>`));
        noo.summNavButtonLast = doCreate.button({
            id: `${optId}-buttonLast`,
            class: `dds__button--tertiary dds__button--sm dds__button__icon dds__pagination__last-page`,
            ariaLabel: `${optAriaLastPage}`,
        });

        noo.comp.appendChild(noo.summ);
        noo.comp.appendChild(noo.summNav);
        noo.summ.appendChild(noo.summPpLabel);
        noo.summ.appendChild(noo.summSelect);
        noo.summ.appendChild(noo.summRange);
        noo.summNav.appendChild(noo.summNavButtonFirst);
        noo.summNav.appendChild(noo.summNavButtonPrev);
        noo.summNav.appendChild(noo.summNavPR);
        noo.summNav.appendChild(noo.summNavButtonNext);
        noo.summNav.appendChild(noo.summNavButtonLast);
        noo.summNavPR.appendChild(noo.summNavPRLabel);
        noo.summNavPR.appendChild(noo.summNavPRCont);
        noo.summNavPR.appendChild(noo.summNavPrTotal);
        noo.summNavPRCont.appendChild(noo.summNavPRContWrap);
        noo.summNavPRContWrap.appendChild(noo.summNavPRContWrapInput);

        if (optCurrentPage) {
            const goPage = () => {
                noo.comp.Pagination.setCurrentPage(optCurrentPage);
                document.removeEventListener(`ddsTableComponentRenderEvent`, goPage);
            };
            document.addEventListener(`ddsTableComponentRenderEvent`, goPage);
        }

        return noo.comp;
    },
    progressBar: (options = {}) => {
        const noo = {};
        const optId = options.id || doCreate.id(`progressBar`);
        const optClass = options.class || ``;
        const optLabel = options.label || ``;
        const optHelper = options.helper || ``;

        noo.comp = doCreate.element(`<div id="${optId}" class="dds__progress-bar ${optClass}" data-dds="progress-bar">`);
        noo.label = doCreate.element(`<span id="${optId}-label" class="dds__progress-bar__label">${optLabel}</span>`);
        noo.indicator = doCreate.element(`<div
            class="dds__progress-bar__indicator"
            role="progressbar"
            aria-labelledby="${optId}-label"
            aria-describedby="${optId}-helper"
        >`);
        noo.helper = doCreate.element(`<span id="${optId}-helper" class="dds__progress-bar__helper-text">${optHelper}</span>`);

        noo.comp.appendChild(noo.label);
        noo.comp.appendChild(noo.indicator);
        noo.comp.appendChild(noo.helper);

        return noo.comp;
    },
    progressTracker: (options = {}) => {
        const noo = {};
        const optId = options.id || doCreate.id(`progressTracker`);
        const optClass = options.class || ``;
        const optItems = options.items || [];

        noo.comp = doCreate.element(`<div id="${optId}" class="dds__progress-tracker ${optClass}" data-dds="progress-tracker">`);
        noo.ol = doCreate.element(`<ol class="dds__progress-tracker">`);

        const addItems = (items) => {
            items.forEach((item, itemIndex) => {
                const newItem = doCreate.progressTrackerItem({
                    item, 
                });
                noo.ol.appendChild(newItem);
            });
        };

        addItems(optItems);

        noo.comp.appendChild(noo.ol);

        doCreate.utils.addApi({
            target: noo.comp, 
            isInternal: options.isInternal,
            api: {
                dispose: (e) => {
                    doCreate.utils.clearChildren(noo.ol);
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
    },
    progressTrackerItem: (options = {}) => {
        if (typeof options === `string`) {
            options = {
                item: string,
            };
        }
        const optId = options.id || doCreate.id(`progressTrackerItem`);
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

        const noo = {};
        noo.item = doCreate.element(`<li class="dds__progress-tracker__item ${optCompleteClass} ${optActiveClass} ${optInactiveClass} ${optClass}">`)
        noo.item.srOnly = doCreate.element(`<span class="dds__sr-only">${optSrOnly}</span>`)
        noo.item.circleIcon = doCreate.element(`<span class="dds__progress-tracker__circle"><span class="dds__progress-tracker__icon"></span></span>`);
        noo.item.content = doCreate.element(`<div class="dds__progress-tracker__content"></div>`)
        noo.item.content.name = isInactive ? doCreate.element(`<span class="dds__progress-tracker__step-name">${optName}</span>`) : doCreate.element(`<a href="${optLink}">${optName}</a>`);
        noo.item.content.text = doCreate.element(`<span>${optText}</span>`);
        if (optClick) {
            noo.item.content.name.addEventListener(`click`, optClick);
        }

        noo.item.appendChild(noo.item.srOnly);
        noo.item.appendChild(noo.item.circleIcon);
        noo.item.appendChild(noo.item.content);
        noo.item.content.appendChild(noo.item.content.name);
        noo.item.content.appendChild(noo.item.content.text);

        return noo.item;
    },
    popover: (options = {}) => {
        const noo = {};
        const optId = options.id || doCreate.id(`popover`);
        const optLabel = options.label || doCreate.icon({
            icon: `help-cir`,
            type: `font`,
        }).outerHTML;
        const optClass = options.class || ``;
        let optTrigger = doCreate.utils.getTarget(options.trigger)
        if (!optTrigger) {
            optTrigger = doCreate.add({
                method:`button`, 
                parent: options.parent,
                options: {
                    label: optLabel,
                }
            }) 
        };
        const optCallback = options.callback || undefined;
        const optTitle = options.title || ``;
        const optBody = options.body || ``;
        const optArrow = options.arrow == `true` || true;
        const optClose = options.close == `true` || true;

        if (!optTrigger) {
            console.error(`DO:Popover :: failed due to no options.trigger`, optTrigger);
            return;
        }
        if (typeof optTrigger === `string`) {
            optTrigger = {
                id: optTrigger.replace(`#`, ``),
            }
        }
        if (!optArrow) {
            // if (dataPlacement.indexOf(`bottom`) > -1) {
            //     doCreate.style(`#${id} { top: -12px;}`);
            // } else if (dataPlacement.indexOf(`top`) > -1) {
            //     doCreate.style(`#${id} { top: 12px;}`);
            // } else if (dataPlacement.indexOf(`left`) > -1) {
            //     doCreate.style(`#${id} { left: 12px;}`);
            // } else if (dataPlacement.indexOf(`right`) > -1) {
            //     doCreate.style(`#${id} { left: -12px;}`);
            // }
            doCreate.style(`#${optId} .dds__popover__pointer { display: none !important;}`);
        }
        if (!optClose) {
            doCreate.style(`#${optId} .dds__popover__close { display: none !important;}`);
        }
        if (!options.title) {
            doCreate.style(`#${optId} .dds__popover__header { display: none !important;}`);
        }
        noo.popover = doCreate.element(`<div 
            id="${optId}"
            class="dds__popover ${optClass}"
            role="dialog"
            aria-labelledby="${optId}-title"
            data-dds="popover"
            data-trigger="#${optTrigger.id}"
        >`);
        noo.content = doCreate.element(`<div class="dds__popover__content">`);
        noo.header = doCreate.element(`<div class="dds__popover__header">`);
        noo.headline = doCreate.element(`<h6 id="${optId}-title" class="dds__popover__headline">${optTitle}</h6>`);
        noo.body = doCreate.element(`<div class="dds__popover__body">${optBody}</div>`);
        if (optCallback) {
            optCallback(noo.body);
        }
        noo.popover.appendChild(noo.content);
        noo.content.appendChild(noo.header);
        noo.content.appendChild(noo.body);
        noo.header.appendChild(noo.headline);
        return noo.popover;
    },
    radioButton: (options = {}) => {
        const noo = {};
        const optId = options.id || doCreate.id(`radiobutton`);
        const optClass = options.class || ``;
        const optLegend = options.legend || ``;

        noo.radioset = doCreate.element(`<fieldset
            class="dds__fieldset dds__radio-button-group ${optClass}"
            role="radiogroup"
        >`);
        if (options.required) {
            noo.radioset.setAttribute(`required`, true);
            noo.radioset.setAttribute(`aria-required`, true);
        }
        noo.legend = doCreate.element(`<legend
            text="${optLegend}"
        >`);
        if (optLegend) noo.radioset.appendChild(noo.legend);
        options.buttons.forEach((radio, rIndex) => {
            const radioClass = radio.class || ``;
            const radioValue = radio.value || ``;
            const radioLabel = radio.label || ``;
            const optDataAttributes = doCreate.utils.getDataAttributes(radio);

            noo.button = doCreate.element(`<div class="dds__radio-button ${radioClass}">`);
            noo.input = doCreate.element(`<input 
                id="${optId}-button${rIndex}"
                name="${optId}-button-name"
                class="dds__radio-button__input"
                type="radio"
                value="${radioValue}"
                ${optDataAttributes}
            >`);
            noo.label = doCreate.element(`<label
                class="dds__radio-button__label"
                id="${optId}-button-label${rIndex}"
                for="${optId}-button${rIndex}"
            >
                ${radioLabel}
            </label>`);
            noo.button.appendChild(noo.input);
            noo.button.appendChild(noo.label);
            noo.radioset.appendChild(noo.button);
        });
        noo.error = doCreate.element(`<div
            id="${optId}-error"
            class="dds__invalid-feedback"
        >
            ${options.error || ``}
        </div>`);
        noo.radioset.appendChild(noo.error);
        return noo.radioset;
    },
    random: (min = 100000000, max = 999999999) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    },
    search: (options = {}) => {
        const noo = {};
        const optId = options.id || doCreate.id(`search`);
        const optClass = options.class || ``;
        const optLabel = options.label || ``;
        const optAutoComplete = options.autoComplete || `off`;
        const optPlaceholder = options.placeholder || ``;
        const optDataAttributes = doCreate.utils.getDataAttributes(options);

        noo.comp = doCreate.element(`<div id="${optId}" class="dds__search ${optClass}" data-dds="search" role="search">`);
        noo.label = doCreate.element(`<label class="dds__label" id="${optId}-label" for="${optId}-control">${optLabel}</label>`);
        noo.wrapper = doCreate.element(`<div class="dds__search__wrapper">`);
        noo.wrapperControl = doCreate.element(`<input
            type="search"
            class="dds__search__control"
            name="${optId}-control-name"
            id="${optId}-control"
            aria-labelledby="${optId}-label"
            autocomplete="${optAutoComplete}"
            placeholder="${optPlaceholder}"
            ${optDataAttributes}
        />`);

        noo.comp.appendChild(noo.label);
        noo.comp.appendChild(noo.wrapper);
        noo.wrapper.appendChild(noo.wrapperControl);

        doCreate.utils.addApi({
            target: noo.comp,
            isInternal: options.isInternal,
            api: {
                addEventListener: (sEvent, sCallback) => {
                    noo.comp.addEventListener(sEvent, sCallback);
                },
                querySelector: (sQuery) => {
                    return noo.comp.querySelector(sQuery);
                },
                focus: () => {
                    noo.wrapperControl.focus();
                },
            }
        });

        return noo.comp;
    },
    select: (options = {}) => {
        // this is to be able to use doCreate.select internally within other doCreate methods and hide the label if needed
        const internalDdsComponentClasses = [`dds__pagination__per-page-select`];
        let isInternalUse = false;
        internalDdsComponentClasses.forEach(iClass => {
            if (options.class && options.class.indexOf(iClass) > -1) {
                isInternalUse = true;
            }
        });

        const noo = {};
        const optId = options.id || doCreate.id(`select`);
        const optClass = options.class || ``;
        const optLabel = options.label || ``;
        const optHelper = options.helper || ``;
        const optError = options.error || `Error`;
        const optSelected = options.selected || undefined;
        let optValues = [];

        options.values.forEach(oValue => {
            if (!oValue.label) {
                optValues.push({
                    value: oValue,
                    label: oValue,
                });
            } else {
                optValues.push(oValue);
            }
        });
        if (optValues.length === 0) {
            optValues.push([{
                value: 0,
                label: `options.values is undefined`
            }]);
        }

        noo.comp = doCreate.element(`<div id="${optId}" class="dds__select ${optClass}" data-dds="select">`);
        noo.wrap = doCreate.element(`<div class="dds__select__wrapper">`);
        noo.wrapSelect = doCreate.element(`<select id="${optId}_control" class="dds__select__field" aria-describedby="${optId}_helper">`);
        optValues.forEach(oValue => {
            const optDataAttributes = doCreate.utils.getDataAttributes(oValue);
            const selected = optSelected === oValue.value ? `selected="true"` : ``;
            const nooOption = doCreate.element(`<option value="${oValue.value}" ${selected} ${optDataAttributes}>${oValue.label}</option>`);
            noo.wrapSelect.appendChild(nooOption);
        });

        if (!isInternalUse) {
            noo.label = doCreate.element(`<label id="${optId}_label" for="${optId}_control" class="dds__label">${optLabel}</label>`);
            noo.comp.appendChild(noo.label);
        }
        noo.comp.appendChild(noo.wrap);
        noo.wrap.appendChild(noo.wrapSelect);

        if (!isInternalUse) {
            noo.wrapSmall = doCreate.element(`<small id="${optId}_helper" class="dds__select__helper">${optHelper}</small>`);
            noo.wrap.appendChild(noo.wrapSmall);
            noo.wrapErr = doCreate.element(`<div id="${optId}_error" class="dds__invalid-feedback">${optError}</div>`);
            noo.wrap.appendChild(noo.wrapErr);
        }

        return noo.comp;
    },
    sideNav: (options = {}) => {
        const noo = {};
        const optId = options.id || doCreate.id(`sidenav`);
        const optClass = options.class || ``;
        const optAriaLabel = options.ariaLabel || ``;
        const count = {
            menus: 0,
            groups: 0,
            items: 0,
        };

        const newMenu = (mInfo = {}) => {
            const elId = `${optId}-${mInfo.id || doCreate.id(`menu`)}`;
            const elClass = `${mInfo.class || ``} ddsc__menu-${count.menus}`;
            const el = {};

            el.ul = doCreate.element(`<ul id="${elId}" class="dds__side-nav__menu ${elClass}">`);

            count.menus++;
            return el.ul;
        };
        const newItem = (iInfo) => {
            const elId = `${optId}-${iInfo.id || iInfo.label.replace(/ /g, ``) || doCreate.id(`item`)}`;
            const elClass = `${iInfo.class || ``} ddsc__item-${count.items}`;
            const elLink = iInfo.link || `javascript:void(0);`;
            const elClick = iInfo.onclick || iInfo.onClick || iInfo.click || undefined;
            const optIcon = doCreate.iconName(iInfo.icon);
            const optLabel = iInfo.label || ``;
            const optDataAttributes = doCreate.utils.getDataAttributes(iInfo);
            const el = {};

            el.sItem = doCreate.element(`<li id="${elId}" class="dds__side-nav__item ${elClass}" ${optDataAttributes}>`);
            el.sItemLink = doCreate.element(`<a href="${elLink}">`);
            el.sItemLinkIcon = doCreate.element(`<span class="dds__icon dds__side-nav__icon ${optIcon}" aria-hidden="true"></span>`);
            el.sItemLinkLabel = doCreate.element(`<span>${optLabel}</span>`);

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
            const elId = `${optId}-${gInfo.id || gInfo.label.replace(/ /g, ``) || doCreate.id(`group`)}`;
            const elClass = `${gInfo.class || ``} ddsc__group-${count.groups}`;
            const optExpanded = gInfo.expanded || false;
            const optIcon = doCreate.iconName(gInfo.icon);
            const optLabel = gInfo.label || ``;
            const el = {};

            el.group = doCreate.element(`<li id="${elId}" class="dds__side-nav__group ${elClass}">`);
            el.groupButton = doCreate.element(`<button type="button" aria-haspopup="true" aria-expanded="${optExpanded}">`);
            el.groupButtonIcon = doCreate.element(`<span class="dds__icon dds__side-nav__icon ${optIcon}" aria-hidden="true"></span>`);
            el.groupButtonLabel = doCreate.element(`<span>${optLabel}</span>`);

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

        noo.comp = doCreate.element(`<nav id="${optId}" data-dds="side-nav" class="dds__side-nav__wrapper ${optClass}" aria-label="${optAriaLabel}">`);
        noo.section = doCreate.element(`<section class="dds__side-nav">`);
        noo.toggle = doCreate.element(`<div class="dds__side-nav__toggle">`);
        noo.toggleLeft = doCreate.element(`<button type="button" aria-label="collapse side navigation">`);
        noo.toggleLeftLabel = doCreate.element(`<span class="dds__icon dds__side-nav__icon dds__icon--chevron-left"></span>`);
        noo.toggleRight = doCreate.element(`<button type="button" aria-label="collapse side navigation">`);
        noo.toggleRightLabel = doCreate.element(`<span class="dds__icon dds__side-nav__icon dds__icon--chevron-right"></span>`);

        noo.comp.appendChild(noo.section);
        noo.comp.appendChild(noo.toggle);
        noo.toggle.appendChild(noo.toggleLeft);
        noo.toggle.appendChild(noo.toggleRight);
        noo.toggleLeft.appendChild(noo.toggleLeftLabel);
        noo.toggleRight.appendChild(noo.toggleRightLabel);

        noo.comp.addMenu = (options = {}) => {
            let optParent = convertParent(options.parent) || noo.section;
            optParent.append(newMenu(options));
        };
        noo.comp.addGroup = (options = {}) => {
            let optParent = convertParent(options.parent) || noo.section;
            optParent.append(newGroup(options));
        };
        noo.comp.addItem = (options = {}) => {
            let optParent = convertParent(options.parent) || noo.section;
            optParent.append(newItem(options));
        };

        return noo.comp;
    },
    style: (styles) => {
        // const styleQuery = styles.match(/.*{/)[0].trim().replace(`{`, ``);
        const styleId = styles.substring(0, styles.indexOf(`{`)).replace(/[^\w\s]/gi, '').trim().replace(/ /g, `_`);
        if (doCreate.stylesCreated.includes(styleId)) {
            return;
        }
        doCreate.stylesCreated.push(styleId);
        var css = document.createElement('style');
        css.id = `${styleId}-style`;
        css.type = 'text/css';
        if (css.styleSheet)
            css.styleSheet.cssText = styles;
        else
            css.appendChild(document.createTextNode(styles));
        /* Append style to the tag name */
        document.getElementsByTagName("head")[0].appendChild(css);
    },
    styleRemove: (styles) => {
        let styleId = styles.substring(0, styles.indexOf(`{`)).replace(/[^\w\s]/gi, '').trim().replace(/ /g, `_`);
        styleId = `${styleId}-style`;
        if (doCreate.stylesCreated.includes(styleId)) {
            doCreate.stylesCreated = doCreate.stylesCreated.filter(item => item !== styleId);
        }
        document.getElementById(styleId)?.remove();
    },
    stylesCreated: [],
    switch: (options = {}) => {
        const noo = {};
        const optId = options.id || doCreate.id(`switch`);
        const optClass = options.class || ``;
        const optTabIndex = options.tabindex || `0`;
        const optChecked = options.checked != null ? options.checked : false;
        const optLabel = options.label || ``;
        const optOn = options.on || `On`;
        const optOff = options.off || `Off`;
        const optClick = options.onclick || options.onClick || options.click || undefined;

        noo.comp = doCreate.element(`<div role="switch" data-dds="switch" tabindex="${optTabIndex}" class="dds__switch ${optClass}" id="${optId}" aria-checked="${optChecked}">`);
        noo.comp.label = doCreate.element(`<span class="dds__switch__label">${optLabel}</span>`);
        noo.comp.area = doCreate.element(`<div class="dds__switch__area" aria-hidden="true">`);
        noo.comp.area.track = doCreate.element(`<span class="dds__switch__track"></span>`);
        noo.comp.area.track.handle = doCreate.element(`<span class="dds__switch__handle"></span>`);
        noo.comp.area.controls = doCreate.element(`<span class="dds__switch__control-label">`);
        noo.comp.area.controls.on = doCreate.element(`<span class="dds__switch__control-label__on">${optOn}</span>`);
        noo.comp.area.controls.off = doCreate.element(`<span class="dds__switch__control-label__off">${optOff}</span>`);

        noo.comp.appendChild(noo.comp.label);
        noo.comp.appendChild(noo.comp.area);
        noo.comp.area.appendChild(noo.comp.area.track);
        noo.comp.area.track.appendChild(noo.comp.area.track.handle);
        noo.comp.area.appendChild(noo.comp.area.controls);
        noo.comp.area.controls.appendChild(noo.comp.area.controls.on);
        noo.comp.area.controls.appendChild(noo.comp.area.controls.off);

        if (optClick) {
            doCreate.listener(`#${optId}`, `click`, optClick);
        }

        return noo.comp;
    },
    table: (options = {}) => {
        const noo = {};
        const optId = options.id || doCreate.id(`table`);
        const optClass = options.class || ``;
        const optRole = options.role || `table`;
        noo.comp = doCreate.element(`<div role="${optRole}" id="${optId}" data-dds="table" class="dds__table ${optClass}"></div>`);
        return noo.comp;
    },
    tabs: (options = {}) => {
        const noo = {};
        const optId = options.id || doCreate.id(`tabs`);
        const optClass = options.class || ``;
        const optTabs = options.tabs || [];

        noo.comp = doCreate.element(`<div id="${optId}" class="dds__tabs ${optClass}" data-dds="tabs">`);
        noo.lists = doCreate.element(`<div class="dds__tabs__list-container">`);
        noo.listsTabs = doCreate.element(`<ul class="dds__tabs__list dds__tabs__list--overflow" role="tablist">`);
        noo.panes = doCreate.element(`<div class="dds__tabs__pane-container">`);

        optTabs.forEach(oTab => {
            const newt = doCreate.tabsItem({
                parentId: optId,
                ...oTab
            });
            noo.listsTabs.appendChild(newt.tab);
            noo.panes.appendChild(newt.pane);
        });

        noo.comp.appendChild(noo.lists);
        noo.comp.appendChild(noo.panes);
        noo.lists.appendChild(noo.listsTabs);

        doCreate.utils.addApi({
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
    },
    tabsItem: (tabInfo) => {
        const parentId = tabInfo.parentId;
        const optId = tabInfo.id || doCreate.id(`tab`);
        const tabLabel = tabInfo.tab;
        const tabContent = tabInfo.pane;
        const tabSelected = tabInfo.selected || false;
        const tabId = `${parentId}-${optId}`;

        const li = {};
        li.el = doCreate.element(`<li role="none">`);
        li.elButton = doCreate.element(`<button id="${tabId}" class="dds__tabs__tab" role="tab" aria-controls="${tabId}-pane" aria-selected="${tabSelected}" tabindex="0">`);
        li.elButtonSpan = doCreate.element(`<span class="dds__tabs__tab__label" title="${tabLabel}">${tabLabel}</span>`);
        li.el.appendChild(li.elButton);
        li.elButton.appendChild(li.elButtonSpan);

        const pane = {};
        pane.el = doCreate.element(`<div 
                id="${tabId}-pane"
                class="dds__tabs__pane"
                role="tabpanel"
                tabindex="0"
                aria-labelledby="${tabId}"
                aria-hidden="${!tabSelected}"
            >${typeof tabContent === `string` ? tabContent : ``}`);
        if (typeof tabContent !== `string`) {
            try {
                pane.el.appendChild(tabContent);
            } catch (e) {
                console.error(`DO: failed trying to append tab content`);
            }
        }
        const parentEl = document.getElementById(parentId);
        if (parentEl && parentEl.Tabs) {
            parentEl.Tabs.tabs.appendChild(li.el);
            parentEl.Tabs.panes.appendChild(pane.el);
            parentEl.Tabs.dispose();
            parentEl.Tabs = DDS.Tabs(document.getElementById(parentId));
        }

        return {
            tab: li.el,
            pane: pane.el
        };
    },
    tag: (options = {}) => {
        const noo = {};
        const optId = options.id || doCreate.id(`tag`);
        const optClass = options.class || ``;
        const optClick = options.onclick || options.onClick || options.click || undefined;
        const optDismiss = options.dismiss || options.dismissible || false;
        const optLabel = options.label || `Tag`;
        const optAriaLabel = options.aria || options.ariaLabel || options.title || ``;

        noo.tag = doCreate.element(`<div
            id="${optId}"
            class="dds__tag ${optClass}"
            data-dds="tag"
            data-dismiss="${optDismiss || false}"
            ${optDismiss ? `data-sr-dismiss="dismiss"` : ``}
        >`);
        noo.button = doCreate.element(`<button type="button" aria-label="${optAriaLabel}">
            ${typeof optLabel === `string` ? optLabel : ``}
        </button>`);
        if (typeof optLabel !== `string`) {
            noo.button.appendChild(optLabel);
        }
        noo.tag.appendChild(noo.button);
        if (optClick) {
            doCreate.listener(`#${optId}`, `click`, optClick);
        }
        return noo.tag;
    },
    textArea: (options = {}) => {
        const noo = {};
        const optId = options.id || doCreate.id(`textinput`);
        const optClass = options.class || ``;
        const optRequired = options.required || false;
        const optLabel = options.label || ``;
        const optHelper = options.helper || ``;
        const optError = options.error || ``;
        const optValue = options.value || ``;
        const optMaxLength = options[`max-length`] || options.max || options.maxLength || ``;
        const optRows = options.rows || ``;
        const optCols = options.cols || ``;
        const optDataAttributes = doCreate.utils.getDataAttributes(options);

        noo.comp = doCreate.element(`<div id="${optId}" class="dds__text-area__container ${optClass}" data-dds="text-area">`);
        noo.header = doCreate.element(`<div class="dds__text-area__header">`);
        noo.headerLabel = doCreate.element(`<label id="${optId}-laebl" for="${optId}-control" class="dds__label ${optRequired ? `dds__label--required` : ``}">${optLabel}</label>`);
        noo.wrapper = doCreate.element(`<div class="dds__text-area__wrapper">`);
        noo.wrapperControl = doCreate.element(`<textarea
            class="dds__text-area"
            id="${optId}-control"
            name="${optId}-control-name"
            aria-labelledby="${optId}-label ${optId}-helper"
            ${optRequired ? `required="true"` : ``}
            ${optMaxLength ? `max-length="${optMaxLength}` : ``}
            ${optRows ? `rows="${optRows}"` : ``}
            ${optCols ? `cols="${optCols}"` : ``}
            ${optDataAttributes}
        >${optValue}</textarea>`);
        noo.wrapperHelper = doCreate.element(`<small id="${optId}-helper" class="dds__input-text__helper">${optHelper}</small>`);
        noo.wrapperError = doCreate.element(`<small id="${optId}-error" class="dds__invalid-feedback">${optError}</small>`);

        noo.comp.appendChild(noo.header);
        noo.comp.appendChild(noo.wrapper);
        noo.header.appendChild(noo.headerLabel);
        noo.wrapper.appendChild(noo.wrapperControl);
        noo.wrapper.appendChild(noo.wrapperHelper);
        noo.wrapper.appendChild(noo.wrapperError);

        return noo.comp;
    },
    textInput: (options = {}) => {
        const noo = {};
        const optId = options.id || doCreate.id(`textinput`);
        const optClass = options.class || ``;
        const optIcon = options.icon || ``;
        const optIconStart = options.iconStart == "true" || true;
        const optLabel = typeof options.label === `string` ? options.label : options.label?.main || ``;
        const optPasswordButton = typeof options.label === `string` ? `Show` : options.label?.password || `Show`;
        const optPasswordTitle = typeof options.label === `string` ? `Show password` : options.label?.title || `Show password`;
        const optPlaceholder = options.placeholder || ``;
        const optRequired = options.required || false;
        const optMaxLength = options[`max-length`] || options.max || options.maxLength || ``;
        const optHelper = options.helper || ``;
        const optError = options.error || ``;
        const optValue = options.value || ``;
        const optClick = options.onclick || options.onClick || options.click || undefined;
        const optChange = options.onchange || options.onChange || options.change || undefined;
        const asFormField = options.asField || options.asFormField || options.formField || false;
        const optType = options.type || `text`;
        let optDataDds = ``;
        let optShowButton = ``;
        switch (optType) {
            case `password`:
                optDataDds = `data-dds="input-password"`
                noo.passWordButton = doCreate.element(`<button type="button" class="dds__input__action dds__input__action--switch" title="${optPasswordTitle}">${optPasswordButton}</button>`);
                break;
            case `tel`:
                optDataDds = `data-dds="input-mask"`
                break;
        }
        const optDataAttributes = doCreate.utils.getDataAttributes(options);

        noo.formField = doCreate.element(`<div class="dds__form__field">`);
        noo.container = doCreate.element(`<div id="${optId}" class="dds__input-text__container ${optClass}" ${optDataDds}>`);
        noo.label = doCreate.element(`<label id="${optId}-label" for="${optId}-input" class="dds__label ${optRequired ? `dds__label--required` : ``}">${optLabel}</label>`);
        noo.wrapper = doCreate.element(`<div class="dds__input-text__wrapper">`);
        noo.input = doCreate.element(`<input
            id="${optId}-input"
            name="${optId}-input-name"
            type="${optType}"
            class="dds__input-text ${optIcon ? optIconStart ? `dds__has__icon--start` : ` dds__has__icon--end` : ``}"
            placeholder="${optPlaceholder}"
            aria-labelledby="${optId}-label ${optId}-helper"
            ${optRequired ? `required="true"` : ``}
            ${optMaxLength ? `max-length="${optMaxLength}` : ``}
            ${optDataAttributes}
        >`);
        if (optValue) {
            noo.input.value = optValue;
        }
        noo.icon = doCreate.element(`<em
            class="dds__icon dds__icon--${optIcon || `search`} dds__input-text__icon--${optIconStart ? `start` : `end`}"
            aria-hidden="true"
        >`);
        noo.helper = doCreate.element(`
            <small
                id="${optId}-helper"
                class="dds__input-text__helper ${!optHelper ? `dds__d-none` : ``}"
            >
                ${optHelper}
            </small>`);
        noo.error = doCreate.element(`<div id="${optId}-error"
            class="dds__invalid-feedback ${!optError ? `dds__d-none` : ``}"
        >
            ${optError}
        </div>`);
        if (!optHelper) {
            doCreate.style(`#${optId} { margin-top: -12px; margin-bottom: 9px;}`);
        }
        if (asFormField) {
            noo.formField.appendChild(noo.container);
        }
        noo.container.appendChild(noo.label);
        if (noo.passWordButton) {
            noo.container.appendChild(noo.passWordButton);
        }
        noo.container.appendChild(noo.wrapper);
        noo.wrapper.appendChild(noo.input);
        if (optIcon) noo.wrapper.appendChild(noo.icon);
        noo.wrapper.appendChild(noo.helper);
        noo.wrapper.appendChild(noo.error);
        if (optClick) {
            doCreate.listener(`#${optId}`, `click`, optClick);
        }
        if (optChange) {
            doCreate.listener(`#${optId}`, `change`, optChange);
        }
        return asFormField ? noo.formField : noo.container;
    },
    timePicker: (options = {}) => {
        const noo = {};
        const optId = options.id || doCreate.id(`timepicker`);
        const optClass = options.class || ``;
        const optRequired = options.required || false;
        const optLabel = options.label || `Select time slot`;
        const optHelper = options.helper || ``;
        const optError = options.error || `Invalid time. Please, type a valid time or select one from the list`;
        const optValue = options.value || ``;
        const optDataAttributes = doCreate.utils.getDataAttributes(options);

        noo.comp = doCreate.element(`<div class="dds__time-picker ${optClass}" id="${optId}" data-dds="time-picker">`);
        noo.comp.container = doCreate.element(`<div class="dds__time-picker__input-container">`);
        noo.comp.container.label = doCreate.element(`<label class="dds__label ${optRequired ? `dds__label--required` : ``}" id="${optId}-label">${optLabel}</label>`);
        noo.comp.container.wrapper = doCreate.element(`<div class="dds__time-picker__input-wrapper">`);
        noo.comp.container.wrapper.input = doCreate.element(`<input
            class="dds__time-picker__input"
            type="text"
            role="combobox"
            autocomplete="off"
            aria-expanded="false"
            aria-autocomplete="list"
            aria-labelledby="${optId}-label ${optId}-helper"
            ${optRequired ? `required="true"` : ``}
            ${optValue ? `value="${optValue}"` : ``}
            ${optDataAttributes}
        >`);
        noo.comp.container.helper = doCreate.element(`<small class="dds__input-text__helper" id="${optId}-helper">${optHelper}</small>`);
        noo.comp.container.error = doCreate.element(`<div class="dds__time-picker__invalid-feedback">${optError}</div>`);

        noo.comp.appendChild(noo.comp.container);
        noo.comp.container.appendChild(noo.comp.container.label);
        noo.comp.container.appendChild(noo.comp.container.wrapper);
        noo.comp.container.wrapper.appendChild(noo.comp.container.wrapper.input);
        noo.comp.container.appendChild(noo.comp.container.helper);
        noo.comp.container.appendChild(noo.comp.container.error);

        return noo.comp;
    },
    tooltip: (options = {}) => {
        const noo = {};
        const optId = options.id || doCreate.id(`tooltip`);
        const optLabel = options.label || ``;
        const optParent = options.parent || document.querySelector(`body`);
        let optTrigger = doCreate.utils.getTarget(options.trigger);
        if (!optTrigger) {
            optTrigger = doCreate.button({
                id: `${optId}-trigger`,
                label: optLabel,
                class: `dds__button--primary`,
            });
            optParent.appendChild(optTrigger);
        }
        const optClass = options.class || ``;
        const optIcon = options.icon != null ? doCreate.iconName(options.icon) : `dds__icon--alert-info-cir`;
        const optTitle = options.title || ``;
        const optTip = options.tip || `No options.tip was found.`;

        noo.container = doCreate.element(`<span class="${optClass}">`);
        noo.anchor = optTrigger;
        noo.anchorSr = doCreate.element(`<span
            id="anchorSr-${optId}"
            class="dds__sr-only"
            text="tooltip"
        >`);
        noo.anchorIcon = doCreate.element(`<span id="anchorIcon-${optId}" class="dds__icon ${optIcon}">`);
        noo.tooltip = doCreate.element(`<div
            id="${optId}"
            class="dds__tooltip"
            role="tooltip"
            data-dds="tooltip"
            data-trigger="#${noo.anchor.id}"
        >`);
        noo.body = doCreate.element(`<div class="dds__tooltip__body">${optTip}</div>`);
        noo.bodyTitle = doCreate.element(`<h6 class="dds__tooltip__title">${optTitle}</h6>`);

        if (noo.anchor && noo.anchor.appendChild) {
            noo.anchor.appendChild(noo.anchorSr);
        }
        if (optIcon) {
            noo.anchor.appendChild(noo.anchorIcon);
        }

        noo.container.appendChild(noo.tooltip);
        noo.tooltip.appendChild(noo.body);
        noo.body.prepend(noo.bodyTitle);

        return noo.tooltip;
    },
    utils: {
        addApi: (options = {}) => {
            const optTarget = options.target;
            const optApi = options.api;
            const isInternal = options.isInternal;

            if (isInternal) {
                optTarget.api = optApi;
            } else {
                Object.keys(optApi).forEach(method => {
                    optTarget[method] = optApi[method];
                });
            }

        },
        addChevronClasses: () => {
            doCreate.style(`
                .do__chevron {
                margin-left: 0.625rem;
                transition: all .2s ease-in;
                pointer-events: none;
                }

                .do__chevron-rotated {
                transform: rotate(180deg);
                }
            `);
        },
        /*
        * converts camelCased words into dashed-cased ones
        * @param {string} key - a string with some number of capitalized letters
        * @return {string} a dashed version of whatever string was entered
        */
        camelDash: (key) => {
            let conversion = key.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
            if (conversion.indexOf(`-`) === 0) {
                conversion = conversion.replace(`-`, ``);
            }
            return conversion;
        },
        capitalize: (s) => {
            return s && s[0].toUpperCase() + s.slice(1);
        },
        clearChildren: (targetEl) => {
            const elChildren = Array.from(targetEl.children);
            elChildren.forEach(c => {
                c.remove();
            });
        },
        /*
        * converts kebab-case words into camelCase ones
        * @param {string} key - a string with some number of dashes
        * @return {string} a camelCase version of whatever string was entered
        */
        dashCamel: function (key) {
            return key.replace(/-[a-z]/g, (m) => m.toUpperCase().replace(/-/gi, ""));
        },
        getTarget: (target, silent = false) => {
            if (!target) {
                return;
            }
            const domStatus = doCreate.utils.getFromDom(target);
            if (domStatus.found) {
                target = domStatus.element
            }
            try {
                if (typeof target !== `string` && !target.id) {
                    target.id = doCreate.id();
                }
            } catch (e) {
                if (!silent) {
                    console.error(`DO: getTarget failed because target is not yet added to the DOM`, e);
                }
            }
            return target;
        },
        getFromDom: (target) => {
            if (!target) {
                return;
            }
            const summary = {
                element: null,
                found: false,
            };
            if (typeof target === `string`) {
                if (target.match(/^#/)) {
                    summary.element = document.getElementById(target.replace(`#`, ``));
                } else {
                    const tryTarget = document.getElementById(target);
                    if (tryTarget) {
                        summary.element = tryTarget;
                    } else {
                        summary.element = document.querySelector(target);
                    }
                }
            } else if (target.id) {
                summary.element = document.getElementById(target.id);
            }
            if (summary.element) {
                summary.found = true;
            }
            return summary;
        },
        getDataAttributes: (options) => {
            const dataAttributes = [];
            Object.keys(options).forEach(key => {
                if (typeof options[key] !== `object` && key.indexOf(`data-`) === 0) {
                    dataAttributes.push(`${key}="${options[key]}"`);
                }
            });
            return dataAttributes.join(` `);
        },
        listeners: [],
    },
};
