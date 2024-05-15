import { DDS } from "@dds/components";
import { doId } from "../do-id";
import { doElement } from "../do-element";
import { addApi } from "../utils/add-api";

// Define interfaces for better type checks
interface AccordionItem {
    head?: string;
    body?: string | HTMLElement;
    expanded?: boolean;
    class?: string;
}

interface AccordionOptions {
    id?: string;
    items?: AccordionItem[];
    class?: string;
    isInternal?: boolean;
}

// Extended type to ensure all properties are properly initialized
interface AccordionComponents {
    acc: HTMLElement;
    items: AccordionItemComponents[];
}

interface AccordionItemComponents {
    item: HTMLElement;
    itemHead: HTMLElement;
    itemHeadButton: HTMLButtonElement;
    itemContent: HTMLElement;
    itemContentBody: HTMLElement;
}

// Assuming `doCreate` and `DDS` have their respective type definitions
export const accordion = (options: AccordionOptions = {}): HTMLElement => {
    const optId = options.id || doId("accordion");
    const optItems = options.items || [];
    const optClass = options.class || "";

    // Initialize the accordion container element
    const acc = doElement(`<div role="region" id="${optId}" class="dds__accordion ${optClass}" data-dds="accordion">`);

    const addItem = (item: AccordionItem, itemIndex: number) => {
        const itemHead = item.head || "";
        const itemBody = item.body || "";
        const itemExpanded = item.expanded ?? false;
        let itemClass = item.class || "";

        if (!itemClass.includes("expanded") && itemExpanded) {
            itemClass += " dds__accordion__item--expanded";
        }

        const itemElement = doElement(`<div class="dds__accordion__item ${itemClass}">`);
        const itemHeadElement = doElement(`<h5 class="dds__accordion__heading">`);
        const itemHeadButton = doElement(`<button
            type="button"
            id="accordion-item-trigger-${optId}-${itemIndex}"
            class="dds__accordion__button"
            aria-expanded="${itemExpanded}"
            aria-controls="accordion-item-content-${optId}-${itemIndex}"
        >${itemHead}</button>`);
        const itemContent = doElement(`<div
            id="accordion-item-content-${optId}-${itemIndex}"
            class="dds__accordion__content"
            role="region"
            aria-labelledby="accordion-item-trigger-${optId}-${itemIndex}"
        >`);
        const itemContentBody = doElement(`<div class="dds__accordion__body">${typeof itemBody === "string" ? itemBody : ''}</div>`);

        if (typeof itemBody === "object") {
            itemContentBody.appendChild(itemBody);
        }

        itemElement.appendChild(itemHeadElement);
        itemHeadElement.appendChild(itemHeadButton);
        itemElement.appendChild(itemContent);
        itemContent.appendChild(itemContentBody);

        acc.appendChild(itemElement);
    };

    optItems.forEach((item, itemIndex) => {
        addItem(item, itemIndex);
    });

    addApi({
        target: acc,
        isInternal: options.isInternal,
        api: {
            appendChild: (newItem: AccordionItem) => {
                optItems.push(newItem);
                addItem(newItem, optItems.length - 1);
                // Assume dispose and initialization methods exist on a global `DDS` object
                // These should be properly typed if available
                if (DDS && DDS.Accordion) {
                    DDS.Accordion.dispose(acc);
                    DDS.Accordion.init(acc);
                }
            },
        }
    });

    return acc as HTMLElement;
};
