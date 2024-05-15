import { doElement } from "../do-element";
import { doXhr } from "../do-xhr";

type IconOptions = {
    icon?: string;
    callback?: (result: string | { all: string; new: string } | null) => void;
};

export const iconDef = (options: IconOptions = {}) => {
    if (!options.icon) {
        console.error(`Cannot create icon definition without options.icon`);
        return;
    }

    const newSvgDef = (newDef?: Element): Element => {
        const newSvg = doElement(`<svg id="doCreate__icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="position: absolute; width: 0; height: 0; overflow: hidden;" aria-hidden="true">`) as Element;
        const newStyle = doElement(`<style type="text/css">
            @keyframes loading-sqr { 0%,100% { opacity: .1; } 25% { opacity: .5; } 45%,75% { opacity: 1; } 95% { opacity: .5; } }
            @keyframes loading-sqrs { 0%,100% { opacity: .1; } 45% { opacity: .8; } 50% { opacity: 1; } 55% { opacity: .25; } }
        </style>`, "svg") as Element;
        const newDefs = doElement(`<defs>`) as Element;
        newSvg.appendChild(newStyle);
        newSvg.appendChild(newDefs);
        if (newDef) {
            newDefs.appendChild(newDef);
        }
        return newSvg;
    };

    let optIcon = options.icon || "dds__icon--accessibility";
    if (!optIcon.startsWith("dds__icon--")) {
        optIcon = `dds__icon--${optIcon}`;
    }
    let svgEl: any = document.getElementById("doCreate__icons");
    if (!(svgEl instanceof SVGElement)) {
        svgEl = newSvgDef();
        document.querySelector("head")?.appendChild(svgEl);
    } 
    if (document.getElementById(optIcon)) {
        options.callback?.(svgEl.outerHTML);
        return;
    }
    let svgDefs: Element;
    if (!svgEl) {
        svgEl = newSvgDef() as SVGElement;
        document.querySelector("head")?.appendChild(svgEl);
    }
    svgDefs = svgEl.querySelector("defs")!;
    
    doXhr.fetch("https://dds.dell.com/icons/2.8.1/dds-icons-defs.svg").then((res: string | null) => {
        if (res === null) {
            console.error('Failed to fetch SVG definitions.');
            options.callback?.(null);
            return;
        }

        const newEl = document.createElement("div");
        newEl.innerHTML = res;
        const outerH = newEl.querySelector(`#${optIcon}`);
        if (!outerH) {
            options.callback?.(null);
            return;
        }
        const iconSymbol = doElement(outerH.outerHTML) as Element;
        svgDefs.appendChild(iconSymbol);
        options.callback?.({
            all: svgEl.outerHTML,
            new: newSvgDef(iconSymbol).outerHTML,
        });
    });
};
