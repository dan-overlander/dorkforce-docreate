import { doId } from "../do-id";
import { doElement } from "../do-element";

// Define an interface for the breadcrumb options
interface BreadcrumbOptions {
    id?: string;
    "aria-label"?: string;
    items?: string[];
}

export const breadcrumb = (options: BreadcrumbOptions = {}) => {
    const optId = options.id || doId("breadcrumb");
    const optAriaLabel = options["aria-label"] || "breadcrumb";
    const optItems = options.items || [];

    const comp = doElement(`<nav id="${optId}" data-dds="dds__breadcrumb" aria-label="${optAriaLabel}">`) as HTMLElement;
    const ol = doElement(`<ol id="${optId}_ol" class="dds__breadcrumb">`) as HTMLElement;
    const olHome = doElement(`<li class="dds__breadcrumb__item">`) as HTMLElement;
    const olHomeA = doElement(`<a href="javascript:;">`) as HTMLElement;
    const olHomeIcon = doElement(`<span class="dds__icon dds__icon--home dds__breadcrumb__home-icon" aria-hidden="true">`) as HTMLElement;
    const olHomeSr = doElement(`<span class="dds__sr-only">Home</span>`) as HTMLElement;

    optItems.forEach(itemText => {
        const item = doElement(`<li class="dds__breadcrumb__item"><a href="javascript:;">${itemText}</a></li>`) as HTMLElement;
        ol.appendChild(item);
    });

    comp.appendChild(ol);
    ol.prepend(olHome);
    olHome.appendChild(olHomeA);
    olHomeA.appendChild(olHomeIcon);
    olHomeA.appendChild(olHomeSr);

    return comp;
};
