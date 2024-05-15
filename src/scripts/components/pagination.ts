import { doId } from "../do-id";
import { doElement } from "../do-element";
import { button } from "./button";
import { select } from "./select";

export const pagination = (options: any = {}) => {
    if (!options.labels) {
        options.labels = {};
    }
    const noo: any = {};
    const optId = options.id || doId(`pagination`);
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


    noo.comp = doElement(`<div class="dds__pagination ${optClass}" data-dds="pagination" id="${optId}" role="navigation" aria-label="${optAriaLabel}" ${optTotalItems != null ? `data-total-items="${optTotalItems}"` : ``}>`);
    noo.summ = doElement(`<div class="dds__pagination__summary">`);
    noo.summPpLabel = doElement(`<label class="dds__pagination__per-page-label" for="${optId}-per-page_control">${optPerPageLabel}</label>`);
    noo.summSelect = select({
        id: `${optId}-per-page`,
        class: `dds__select--sm dds__pagination__per-page-select`,
        values: optPerPageValues,
        selected: optRowsPerPage,
    });
    noo.summRange = doElement(`<div class="dds__pagination__range" aria-live="polite">–</div>`);
    noo.summRangeStart = doElement(`<span class="dds__pagination__range-start"></span>`);
    noo.summRangeEnd = doElement(`<span class="dds__pagination__range-end"></span>`);
    noo.summRangeLabel = doElement(`<span class="dds__pagination__range-total-label">${optOf}</span>`);
    noo.summRangeLabelTotal = doElement(`<span class="dds__pagination__range-total"></span>`);

    noo.summRange.prepend(noo.summRangeStart);
    noo.summRange.appendChild(noo.summRangeEnd);
    noo.summRange.appendChild(noo.summRangeLabel);
    noo.summRangeLabel.appendChild(noo.summRangeLabelTotal);
    noo.summRangeLabel.innerHTML += optItems;

    noo.summNav = doElement(`<div class="dds__pagination__nav">`);
    noo.summNavButtonFirst = button({
        id: `${optId}-buttonFirst`,
        class: `dds__button--tertiary dds__button--sm dds__button__icon dds__pagination__first-page`,
        ariaLabel: `${optAriaFirstPage}`,
    });
    noo.summNavButtonPrev = button({
        id: `${optId}-buttonPrevious`,
        class: `dds__button--tertiary dds__button--sm dds__pagination__prev-page`,
    });

    noo.summNavButtonPrev.appendChild(doElement(`<span class="dds__pagination__prev-page-label">${optAriaPreviousPage}</span>`));

    noo.summNavPR = doElement(`<div class="dds__pagination__page-range">`)
    noo.summNavPRLabel = doElement(`<label class="dds__pagination__page-range-label" for="${optId}_pageRange">Page</label>`);
    noo.summNavPRCont = doElement(`<div class="dds__input-text__container dds__input-text__container--sm">`);
    noo.summNavPRContWrap = doElement(`<div class="dds__input-text__wrapper dds__pagination__page-range-current-wrapper">`);
    noo.summNavPRContWrapInput = doElement(`<input class="dds__input-text dds__pagination__page-range-current" type="text" id="${optId}_pageRange">`);
    noo.summNavPrTotal = doElement(`
        <div class="dds__pagination__page-range-total-label">
            ${optOf}
            <span class="dds__pagination__page-range-total"></span>
        </div>`);
    noo.summNavButtonNext = button({
        id: `${optId}-buttonNext`,
        class: `dds__button--tertiary dds__button--sm dds__pagination__next-page`,
    });
    noo.summNavButtonNext.appendChild(doElement(`<span class="dds__pagination__next-page-label">${optAriaNextPage}</span>`));
    noo.summNavButtonLast = button({
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
};