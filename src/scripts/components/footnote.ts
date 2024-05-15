import { doId } from "../do-id";
import { doElement } from "../do-element";
import { getTarget } from "../utils/get-target";

let footnotesCreated = 0;

export const footnote = (options: any = {}) => {
    const noo: any = {};
    const optId = options.id || doId(`footnote`);
    let optNumber = options.number;
    if (!optNumber) {
        footnotesCreated++;
        optNumber = footnotesCreated;
    }
    const optClass = options.class || ``;
    const optNote = options.note || ``;
    const optTitle = options.title || `Jump back to the related footnote in the text.`;
    const optAriaLabel = options.ariaLabel || `Back to reference`;
    const optSrOnly = options.srOnly || `Footnotes`;
    let optRoot = getTarget(options.target) || document.querySelector(`.dds__footnote`);

    noo.sup = doElement(`<sup id="${optId}">`);
    noo.supA = doElement(`<a href="#${optId}-note" id="${optId}-anchor" aria-describedby="${optId}-label">[${optNumber}]</a>`);
    noo.li = doElement(`<li id="${optId}-note">${optNote}</li>`);
    noo.liA = doElement(`<a href="#${optId}" title="${optTitle}" aria-label="${optAriaLabel}">[ ? ]</a>`);

    if (!optRoot || !optRoot.classList.contains(`dds__footnote`)) {
        optRoot = doElement(`<footer class="dds__footnote">`);
        document.querySelector(`body`)?.appendChild(optRoot);
    }
    if (!optRoot.querySelector(`.dds__sr-only`)) {
        optRoot.appendChild(doElement(`<h2 id="${optId}-label" class="dds__sr-only">${optSrOnly}</h2>`));
    }
    if (!optRoot.querySelector(`ol`)) {
        optRoot.appendChild(doElement(`<ol>`))
    }

    optRoot.querySelector(`ol`).appendChild(noo.li);
    noo.li.appendChild(noo.liA);

    noo.sup.appendChild(noo.supA);
    return noo.sup;
};